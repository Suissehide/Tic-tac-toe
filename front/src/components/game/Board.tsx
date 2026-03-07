import { cn } from '../../libs/utils'
import type { Mark, MoveHistory } from '../../store/useGameStore'

const POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

interface BoardProps {
  board: string[]
  winLine: number[]
  moveHistory: MoveHistory
  onCellClick: (index: number) => void
  disabled: boolean
  myMark: Mark | null
  currentTurn: Mark | null
}

export function Board({
  board,
  winLine,
  moveHistory,
  onCellClick,
  disabled,
  myMark,
  currentTurn,
}: BoardProps) {
  const isMyTurn = myMark !== null && currentTurn === myMark && !disabled

  // The oldest piece per player is at index 0 of their history — it vanishes on their next move
  const vanishSoonX = moveHistory.X.length >= 3 ? moveHistory.X[0] : null
  const vanishSoonO = moveHistory.O.length >= 3 ? moveHistory.O[0] : null

  return (
    <div className="board-grid">
      {POSITIONS.map((i) => {
        const cell = board[i]
        const isWin = winLine.includes(i)
        const isClickable = isMyTurn && cell === ''
        const isVanishSoon =
          (cell === 'X' && vanishSoonX === i) ||
          (cell === 'O' && vanishSoonO === i)

        return (
          <button
            key={i}
            type="button"
            aria-label={cell ? `Case ${i + 1} : ${cell}` : `Case ${i + 1} vide`}
            onClick={() => isClickable && onCellClick(i)}
            disabled={!isClickable}
            className={cn(
              'board-cell',
              isClickable && 'board-cell--clickable',
              isWin && cell === 'X' && 'board-cell--win-x',
              isWin && cell === 'O' && 'board-cell--win-o',
            )}
          >
            {cell ? (
              <span
                className={cn(
                  'board-mark mark-animate',
                  cell === 'X' ? 'board-mark--x' : 'board-mark--o',
                  isWin && 'board-mark--win',
                  isVanishSoon && !isWin && 'board-mark--vanish',
                )}
              >
                {cell}
              </span>
            ) : (
              <span className="board-cell-hint" aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}
