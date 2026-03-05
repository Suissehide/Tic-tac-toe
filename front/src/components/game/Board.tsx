import { cn } from '../../libs/utils'
import type { Mark } from '../../store/useGameStore'

interface BoardProps {
  board: string[]
  winLine: number[]
  onCellClick: (index: number) => void
  disabled: boolean
  myMark: Mark | null
  currentTurn: Mark | null
}

export function Board({ board, winLine, onCellClick, disabled, myMark, currentTurn }: BoardProps) {
  const isMyTurn = myMark !== null && currentTurn === myMark && !disabled

  return (
    <div className="board-grid" role="grid" aria-label="Plateau de jeu">
      {board.map((cell, i) => {
        const isWin = winLine.includes(i)
        const isClickable = isMyTurn && cell === ''

        return (
          <button
            key={i}
            type="button"
            role="gridcell"
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
