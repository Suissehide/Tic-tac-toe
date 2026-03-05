import type { Mark, GameStatus, Role } from '../../store/useGameStore'

interface GameStatusProps {
  status: GameStatus
  turn: Mark | null
  players: { X: string; O: string }
  winner: Mark | 'draw' | null
  role: Role
  myMark: Mark | null
  spectatorCount: number
  onRematch: () => void
}

export function GameStatusBar({
  status,
  turn,
  players,
  winner,
  role,
  myMark,
  spectatorCount,
  onRematch,
}: GameStatusProps) {
  const isSpectator = role === 'spectator'
  const isMyTurn = !isSpectator && turn === myMark

  return (
    <div className="flex flex-col items-center gap-3 min-h-[5rem]">
      {status === 'waiting' && (
        <div className="flex items-center gap-2">
          <span className="status-waiting animate-pulse">
            EN ATTENTE D'UN ADVERSAIRE
          </span>
          <span className="inline-flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </div>
      )}

      {status === 'playing' && turn && (
        <div className="flex flex-col items-center gap-1">
          <p className="status-turn">
            <span style={{ color: turn === 'X' ? 'var(--x-color)' : 'var(--o-color)' }}>
              {players[turn] || turn}
            </span>
            {isMyTurn ? (
              <span className="text-foreground/50 text-base font-normal" style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
                — TON TOUR
              </span>
            ) : !isSpectator ? (
              <span className="text-foreground/30 text-base font-normal" style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
                joue...
              </span>
            ) : null}
          </p>
        </div>
      )}

      {status === 'finished' && winner && (
        <div className="flex flex-col items-center gap-3">
          {winner === 'draw' ? (
            <p className="status-winner" style={{ color: 'var(--foreground)' }}>
              MATCH NUL
            </p>
          ) : (
            <p className="status-winner" style={{ color: winner === 'X' ? 'var(--x-color)' : 'var(--o-color)' }}>
              {players[winner] || winner} GAGNE
            </p>
          )}
          {!isSpectator && (
            <button
              type="button"
              onClick={onRematch}
              className="game-btn game-btn--ghost"
            >
              REVANCHE
            </button>
          )}
        </div>
      )}

      {spectatorCount > 0 && (
        <p className="label-mono flex items-center gap-1.5" style={{ marginTop: status === 'waiting' ? 0 : undefined }}>
          <span>👁</span>
          <span>{spectatorCount} SPECTATEUR{spectatorCount > 1 ? 'S' : ''}</span>
        </p>
      )}
    </div>
  )
}
