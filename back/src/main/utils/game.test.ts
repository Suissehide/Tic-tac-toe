import { checkWin, checkDraw, generateRoomCode, createBoard, nextTurn } from './game'

describe('createBoard', () => {
  it('creates a 9-element empty board', () => {
    expect(createBoard()).toEqual(['','','','','','','','',''])
  })
})

describe('checkWin', () => {
  it('detects horizontal win on row 0', () => {
    const board = ['X','X','X','','','','','','']
    expect(checkWin(board, 'X')).toEqual([0, 1, 2])
  })
  it('detects vertical win on col 1', () => {
    const board = ['','X','','','X','','','X','']
    expect(checkWin(board, 'X')).toEqual([1, 4, 7])
  })
  it('detects diagonal win', () => {
    const board = ['X','','','','X','','','','X']
    expect(checkWin(board, 'X')).toEqual([0, 4, 8])
  })
  it('returns null when no win', () => {
    const board = ['X','O','X','','','','','','']
    expect(checkWin(board, 'X')).toBeNull()
  })
})

describe('checkDraw', () => {
  it('returns true when board full and no winner', () => {
    const board = ['X','O','X','X','O','X','O','X','O']
    expect(checkDraw(board)).toBe(true)
  })
  it('returns false when board not full', () => {
    const board = ['X','O','X','','','','','','']
    expect(checkDraw(board)).toBe(false)
  })
})

describe('generateRoomCode', () => {
  it('generates a 6-character uppercase alphanumeric code', () => {
    const code = generateRoomCode()
    expect(code).toMatch(/^[A-Z0-9]{6}$/)
  })
})
