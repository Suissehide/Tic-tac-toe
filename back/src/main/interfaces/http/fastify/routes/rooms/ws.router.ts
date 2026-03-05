import type { FastifyPluginAsync } from 'fastify'
import type { WebSocket } from '@fastify/websocket'
import { roomStore } from '../../../../../infra/room-store'
import type { Room, Player, Mark, ClientMessage } from '../../../../../types/game/room'
import { checkWin, checkDraw, nextTurn, createBoard } from '../../../../../utils/game'

export const wsRoomRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Params: { code: string }
    Querystring: { playerId?: string; pseudo?: string; spectator?: string }
  }>(
    '/:code/ws',
    { websocket: true },
    (socket: WebSocket, request) => {
      const { code } = request.params
      const { playerId, pseudo, spectator } = request.query

      const room = roomStore.getRoom(code)
      if (!room) {
        socket.close(4004, 'Room not found')
        return
      }

      // Spectator connection
      if (spectator === 'true') {
        const specId = playerId || crypto.randomUUID()
        room.spectators.push({ id: specId, ws: socket })
        roomStore.broadcast(room, { type: 'spectator:count', count: room.spectators.length })
        roomStore.send(socket, {
          type: 'room:state',
          board: room.board,
          turn: room.currentTurn,
          players: Object.fromEntries(room.players.map((p) => [p.mark, p.pseudo])),
          status: room.status,
          winner: room.winner,
          spectatorCount: room.spectators.length,
        })

        socket.on('close', () => {
          room.spectators = room.spectators.filter((s) => s.id !== specId)
          roomStore.broadcast(room, { type: 'spectator:count', count: room.spectators.length })
        })
        return
      }

      // Player connection
      if (!playerId || !pseudo) {
        socket.close(4001, 'Missing playerId or pseudo')
        return
      }

      const player = room.players.find((p) => p.id === playerId)
      if (!player) {
        socket.close(4003, 'Not registered in this room')
        return
      }

      // Reconnection: clear timer, update ws
      roomStore.clearReconnectTimer(room, playerId)
      const wasDisconnected = !player.connected
      player.ws = socket
      player.connected = true
      player.pseudo = pseudo

      if (wasDisconnected && room.status === 'playing') {
        roomStore.broadcast(room, { type: 'player:reconnected', pseudo: player.pseudo })
      }

      // Send current game state to (re)connecting player
      roomStore.send(socket, {
        type: 'room:state',
        board: room.board,
        turn: room.currentTurn,
        players: Object.fromEntries(room.players.map((p) => [p.mark, p.pseudo])),
        status: room.status,
        winner: room.winner,
        spectatorCount: room.spectators.length,
      })

      // Start game when both players are connected
      if (
        room.status === 'waiting' &&
        room.players.length === 2 &&
        room.players.every((p) => p.connected)
      ) {
        room.status = 'playing'
        const players = Object.fromEntries(room.players.map((p) => [p.mark, p.pseudo])) as Record<Mark, string>
        roomStore.broadcast(room, { type: 'game:start', board: room.board, turn: room.currentTurn, players })
      }

      socket.on('message', (raw) => {
        let msg: ClientMessage
        try {
          msg = JSON.parse(raw.toString())
        } catch {
          return
        }

        if (msg.type === 'ping') {
          roomStore.send(socket, { type: 'pong' })
          return
        }

        if (msg.type === 'game:move') {
          handleMove(room, player, msg.index, socket)
          return
        }

        if (msg.type === 'game:rematch') {
          handleRematch(room, player)
          return
        }
      })

      socket.on('close', () => {
        player.connected = false
        player.ws = null

        // If no opponent yet (waiting), remove room immediately
        if (room.status === 'waiting') {
          roomStore.deleteRoom(room.code)
          return
        }

        if (room.status === 'playing') {
          roomStore.broadcast(room, {
            type: 'player:disconnected',
            pseudo: player.pseudo,
            reconnectDelay: 30,
          })
          roomStore.scheduleReconnect(room, player.id, () => {
            const opponent = room.players.find((p) => p.id !== player.id)
            room.status = 'finished'
            roomStore.broadcast(room, { type: 'player:abandoned', pseudo: player.pseudo })
            if (opponent) {
              room.winner = opponent.mark
              roomStore.broadcast(room, { type: 'game:end', winner: opponent.mark, winLine: [] })
            }
            roomStore.scheduleCleanup(room)
          })
        }
      })
    },
  )
}

function handleMove(room: Room, player: Player, index: number, socket: WebSocket) {
  if (room.status !== 'playing') {
    roomStore.send(socket, { type: 'error', message: 'Game is not in progress' })
    return
  }
  if (room.currentTurn !== player.mark) {
    roomStore.send(socket, { type: 'error', message: 'Not your turn' })
    return
  }
  const opponent = room.players.find((p) => p.id !== player.id)
  if (opponent && !opponent.connected) {
    roomStore.send(socket, { type: 'error', message: 'Waiting for opponent to reconnect' })
    return
  }
  if (index < 0 || index > 8 || room.board[index] !== '') {
    roomStore.send(socket, { type: 'error', message: 'Invalid move' })
    return
  }

  room.board[index] = player.mark
  const winLine = checkWin(room.board, player.mark)

  if (winLine) {
    room.status = 'finished'
    room.winner = player.mark
    room.winLine = winLine
    roomStore.broadcast(room, { type: 'game:end', winner: player.mark, winLine })
    roomStore.scheduleCleanup(room)
    return
  }

  if (checkDraw(room.board)) {
    room.status = 'finished'
    room.winner = 'draw'
    roomStore.broadcast(room, { type: 'game:end', winner: 'draw', winLine: [] })
    roomStore.scheduleCleanup(room)
    return
  }

  room.currentTurn = nextTurn(room.currentTurn)
  roomStore.broadcast(room, { type: 'game:update', board: room.board, turn: room.currentTurn })
}

function handleRematch(room: Room, player: Player) {
  room.rematchVotes.add(player.id)
  if (room.rematchVotes.size === 2) {
    room.board = createBoard()
    room.currentTurn = 'X'
    room.status = 'playing'
    room.winner = null
    room.winLine = null
    room.rematchVotes.clear()
    if (room.cleanupTimer) {
      clearTimeout(room.cleanupTimer)
      room.cleanupTimer = null
    }
    roomStore.broadcast(room, { type: 'game:rematch', board: room.board, turn: room.currentTurn })
  }
}
