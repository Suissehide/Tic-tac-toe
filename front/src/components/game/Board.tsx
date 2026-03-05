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
    <div className="grid grid-cols-3 gap-2 w-64 h-64">
      {board.map((cell, i) => {
        const isWinCell = winLine.includes(i)
        const isClickable = isMyTurn && cell === ''
        return (
          <button
            key={i}
            type="button"
            onClick={() => isClickable && onCellClick(i)}
            className={cn(
              'flex items-center justify-center rounded-lg border-2 text-4xl font-bold transition-colors',
              isClickable && 'hover:bg-muted cursor-pointer',
              !isClickable && 'cursor-default',
              isWinCell && 'bg-primary/20 border-primary',
              cell === 'X' && 'text-blue-500',
              cell === 'O' && 'text-rose-500',
            )}
            disabled={!isClickable}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}
