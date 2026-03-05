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

  return (
    <div className="text-center space-y-2">
      {status === 'waiting' && (
        <p className="text-muted-foreground animate-pulse">En attente d'un adversaire...</p>
      )}

      {status === 'playing' && turn && (
        <p className="font-medium">
          Tour de :{' '}
          <span className={turn === 'X' ? 'text-blue-500' : 'text-rose-500'}>
            {players[turn]} ({turn})
          </span>
          {!isSpectator && turn === myMark && ' — À toi !'}
        </p>
      )}

      {status === 'finished' && winner && (
        <div className="space-y-2">
          {winner === 'draw' ? (
            <p className="font-bold text-lg">Match nul !</p>
          ) : (
            <p className="font-bold text-lg">
              {players[winner]} ({winner}) a gagné !
            </p>
          )}
          {!isSpectator && (
            <button
              type="button"
              onClick={onRematch}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
            >
              Revanche
            </button>
          )}
        </div>
      )}

      {spectatorCount > 0 && (
        <p className="text-xs text-muted-foreground">
          👁 {spectatorCount} spectateur{spectatorCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
