import type { Board, Mark } from '../types/game/room'

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const

export function createBoard(): Board {
  return Array<Mark | ''>(9).fill('')
}

export function checkWin(board: Board, mark: Mark): number[] | null {
  for (const line of WIN_LINES) {
    if (line.every((i) => board[i] === mark)) return line
  }
  return null
}

// Precondition: must be called only after checkWin returns null.
export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== '')
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function nextTurn(current: Mark): Mark {
  return current === 'X' ? 'O' : 'X'
}
