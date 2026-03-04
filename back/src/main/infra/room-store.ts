import type { Room, Mark, Player, Spectator } from '../types/game/room'
import { createBoard, generateRoomCode } from '../utils/game'

const RECONNECT_DELAY_MS = 30_000
const CLEANUP_DELAY_MS = 5 * 60_000

export class RoomStore {
  private rooms = new Map<string, Room>()

  createRoom(playerId: string, pseudo: string): Room {
    let code: string
    do {
      code = generateRoomCode()
    } while (this.rooms.has(code))

    const player: Player = {
      id: playerId,
      pseudo,
      mark: 'X',
      ws: null,
      connected: false,
    }

    const room: Room = {
      code,
      players: [player],
      spectators: [],
      board: createBoard(),
      currentTurn: 'X',
      status: 'waiting',
      winner: null,
      winLine: null,
      reconnectTimers: new Map(),
      rematchVotes: new Set(),
      cleanupTimer: null,
    }

    this.rooms.set(code, room)
    return room
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code)
  }

  canJoinAsPlayer(room: Room, playerId: string): boolean {
    if (room.players.some((p) => p.id === playerId)) return true
    return room.players.length < 2
  }

  joinAsPlayer(room: Room, playerId: string, pseudo: string): Player {
    const existing = room.players.find((p) => p.id === playerId)
    if (existing) return existing

    const mark: Mark = room.players[0].mark === 'X' ? 'O' : 'X'
    const player: Player = { id: playerId, pseudo, mark, ws: null, connected: false }
    room.players.push(player)
    return player
  }

  scheduleReconnect(room: Room, playerId: string, onAbandoned: () => void): void {
    this.clearReconnectTimer(room, playerId)
    const timer = setTimeout(() => {
      room.reconnectTimers.delete(playerId)
      onAbandoned()
    }, RECONNECT_DELAY_MS)
    room.reconnectTimers.set(playerId, timer)
  }

  clearReconnectTimer(room: Room, playerId: string): void {
    const timer = room.reconnectTimers.get(playerId)
    if (timer) {
      clearTimeout(timer)
      room.reconnectTimers.delete(playerId)
    }
  }

  scheduleCleanup(room: Room): void {
    if (room.cleanupTimer) clearTimeout(room.cleanupTimer)
    room.cleanupTimer = setTimeout(() => {
      this.deleteRoom(room.code)
    }, CLEANUP_DELAY_MS)
  }

  deleteRoom(code: string): void {
    const room = this.rooms.get(code)
    if (!room) return
    for (const timer of room.reconnectTimers.values()) clearTimeout(timer)
    if (room.cleanupTimer) clearTimeout(room.cleanupTimer)
    this.rooms.delete(code)
  }

  broadcast(room: Room, message: object, excludeId?: string): void {
    const json = JSON.stringify(message)
    for (const p of room.players) {
      if (p.ws && p.connected && p.id !== excludeId) {
        p.ws.send(json)
      }
    }
    for (const s of room.spectators) {
      if (s.id !== excludeId) {
        s.ws.send(json)
      }
    }
  }

  send(ws: import('@fastify/websocket').WebSocket, message: object): void {
    ws.send(JSON.stringify(message))
  }
}

export const roomStore = new RoomStore()
