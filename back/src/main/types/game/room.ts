import type { WebSocket } from '@fastify/websocket'

export type Mark = 'X' | 'O'
export type Board = (Mark | '')[]
export type GameStatus = 'waiting' | 'playing' | 'finished'

export interface Player {
  id: string
  pseudo: string
  mark: Mark
  ws: WebSocket | null
  connected: boolean
}

export interface Spectator {
  id: string
  ws: WebSocket
}

export interface Room {
  code: string
  players: Player[]
  spectators: Spectator[]
  board: Board
  currentTurn: Mark
  status: GameStatus
  winner: Mark | 'draw' | null
  winLine: number[] | null
  moveHistory: { X: number[]; O: number[] }
  scores: Record<Mark, number>
  reconnectTimers: Map<string, ReturnType<typeof setTimeout>>
  rematchVotes: Set<string>
  cleanupTimer: ReturnType<typeof setTimeout> | null
}

export type MoveHistory = { X: number[]; O: number[] }

export type ServerMessage =
  | { type: 'game:start'; board: Board; turn: Mark; players: Record<Mark, string>; moveHistory: MoveHistory; scores: Record<Mark, number> }
  | { type: 'game:update'; board: Board; turn: Mark; moveHistory: MoveHistory }
  | { type: 'game:end'; winner: Mark | 'draw'; winLine: number[]; board: Board; moveHistory: MoveHistory; scores: Record<Mark, number> }
  | { type: 'game:rematch'; board: Board; turn: Mark; moveHistory: MoveHistory; scores: Record<Mark, number> }
  | { type: 'game:rematch_vote'; mark: Mark }
  | { type: 'player:disconnected'; pseudo: string; reconnectDelay: number }
  | { type: 'player:reconnected'; pseudo: string }
  | { type: 'player:abandoned'; pseudo: string }
  | { type: 'spectator:count'; count: number }
  | { type: 'room:state'; board: Board; turn: Mark; players: Record<Mark, string>; status: GameStatus; winner: Mark | 'draw' | null; spectatorCount: number; moveHistory: MoveHistory; scores: Record<Mark, number> }
  | { type: 'error'; message: string }

export type ClientMessage =
  | { type: 'game:move'; index: number }
  | { type: 'game:rematch' }
  | { type: 'ping' }
