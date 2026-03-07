import type { Mark } from '../../store/useGameStore'

interface PlayerBadgeProps {
  mark: Mark
  name: string
  isActive: boolean
  score: number
  reversed?: boolean
}

export function PlayerBadge({
  mark,
  name,
  isActive,
  score,
  reversed = false,
}: PlayerBadgeProps) {
  const color = mark === 'X' ? 'var(--x-color)' : 'var(--o-color)'

  const dot = isActive && (
    <span
      className="w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ background: color }}
    />
  )

  const markLabel = (
    <span className="label-mono" style={{ color, opacity: 0.5 }}>
      {mark}
    </span>
  )

  const playerName = (
    <span className="player-name" style={{ color }}>
      {name || '?'}
    </span>
  )

  const scoreLabel = (
    <span
      className="label-mono tabular-nums"
      style={{ color, opacity: score > 0 ? 1 : 0.25, minWidth: '1ch', textAlign: 'center' }}
    >
      {score}
    </span>
  )

  return (
    <div className="flex items-center gap-1.5">
      {reversed ? (
        <>
          {dot}
          {scoreLabel}
          {markLabel}
          {playerName}
        </>
      ) : (
        <>
          {playerName}
          {markLabel}
          {scoreLabel}
          {dot}
        </>
      )}
    </div>
  )
}
