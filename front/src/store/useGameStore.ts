import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Mark = 'X' | 'O'
export type GameStatus = 'waiting' | 'playing' | 'finished'
export type Role = Mark | 'spectator'

export type MoveHistory = { X: number[]; O: number[] }

export interface GameState {
  pseudo: string
  playerId: string
  roomCode: string
  role: Role
  board: string[]
  turn: Mark | null
  status: GameStatus
  players: { X: string; O: string }
  spectatorCount: number
  winner: Mark | 'draw' | null
  winLine: number[]
  moveHistory: MoveHistory
  disconnectedPlayer: { pseudo: string; secondsLeft: number } | null
  rematchVotes: Mark[]
}

export interface GameActions {
  setIdentity: (pseudo: string, playerId: string) => void
  setRoom: (roomCode: string, role: Role) => void
  applyMessage: (msg: ServerMessage) => void
  reset: () => void
}

export type ServerMessage =
  | { type: 'game:start'; board: string[]; turn: Mark; players: Record<Mark, string>; moveHistory: MoveHistory }
  | { type: 'game:update'; board: string[]; turn: Mark; moveHistory: MoveHistory }
  | { type: 'game:end'; winner: Mark | 'draw'; winLine: number[]; board: string[]; moveHistory: MoveHistory }
  | { type: 'game:rematch'; board: string[]; turn: Mark; moveHistory: MoveHistory }
  | { type: 'game:rematch_vote'; mark: Mark }
  | { type: 'player:disconnected'; pseudo: string; reconnectDelay: number }
  | { type: 'player:reconnected'; pseudo: string }
  | { type: 'player:abandoned'; pseudo: string }
  | { type: 'spectator:count'; count: number }
  | { type: 'room:state'; board: string[]; turn: Mark; players: Record<Mark, string>; status: GameStatus; winner: Mark | 'draw' | null; spectatorCount: number; moveHistory: MoveHistory }
  | { type: 'error'; message: string }

const initialState: GameState = {
  pseudo: '',
  playerId: '',
  roomCode: '',
  role: 'spectator',
  board: Array(9).fill(''),
  turn: null,
  status: 'waiting',
  players: { X: '', O: '' },
  spectatorCount: 0,
  winner: null,
  winLine: [],
  moveHistory: { X: [], O: [] },
  disconnectedPlayer: null,
  rematchVotes: [],
}

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setIdentity: (pseudo, playerId) => set({ pseudo, playerId }),

      setRoom: (roomCode, role) => set({ roomCode, role }),

      applyMessage: (msg) => {
        switch (msg.type) {
          case 'game:start':
            set({ board: msg.board, turn: msg.turn, players: msg.players as { X: string; O: string }, status: 'playing', moveHistory: msg.moveHistory })
            break
          case 'game:update':
            set({ board: msg.board, turn: msg.turn, moveHistory: msg.moveHistory, disconnectedPlayer: null })
            break
          case 'game:end':
            set({ board: msg.board, winner: msg.winner, winLine: msg.winLine, status: 'finished', moveHistory: msg.moveHistory, rematchVotes: [] })
            break
          case 'game:rematch_vote':
            set((s) => ({ rematchVotes: s.rematchVotes.includes(msg.mark) ? s.rematchVotes : [...s.rematchVotes, msg.mark] }))
            break
          case 'game:rematch':
            set({ board: msg.board, turn: msg.turn, status: 'playing', winner: null, winLine: [], moveHistory: msg.moveHistory, disconnectedPlayer: null, rematchVotes: [] })
            break
          case 'player:disconnected':
            set({ disconnectedPlayer: { pseudo: msg.pseudo, secondsLeft: msg.reconnectDelay } })
            break
          case 'player:reconnected':
            set({ disconnectedPlayer: null })
            break
          case 'player:abandoned':
            set({ disconnectedPlayer: null })
            break
          case 'spectator:count':
            set({ spectatorCount: msg.count })
            break
          case 'room:state':
            set({
              board: msg.board,
              turn: msg.turn,
              players: msg.players as { X: string; O: string },
              status: msg.status,
              winner: msg.winner,
              spectatorCount: msg.spectatorCount,
              moveHistory: msg.moveHistory,
            })
            break
          case 'error':
            // Silently ignore server errors (UI handles game state)
            break
        }
      },

      reset: () => set(initialState),
    }),
    { name: 'game-store' },
  ),
)
