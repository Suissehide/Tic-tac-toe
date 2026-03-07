import type { Mark } from '../../store/useGameStore'

interface PlayerBadgeProps {
  mark: Mark
  name: string
  isActive: boolean
  reversed?: boolean
}

export function PlayerBadge({
  mark,
  name,
  isActive,
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

  return (
    <div className="flex items-center gap-1.5">
      {reversed ? (
        <>
          {dot}
          {markLabel}
          {playerName}
        </>
      ) : (
        <>
          {playerName}
          {markLabel}
          {dot}
        </>
      )}
    </div>
  )
}
