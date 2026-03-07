import { Eye } from 'lucide-react'

import type { GameStatus, Mark, Role } from '../../store/useGameStore'

interface GameStatusProps {
  status: GameStatus
  turn: Mark | null
  players: { X: string; O: string }
  winner: Mark | 'draw' | null
  role: Role
  myMark: Mark | null
  spectatorCount: number
  rematchVotes: Mark[]
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
  rematchVotes,
  onRematch,
}: GameStatusProps) {
  const isSpectator = role === 'spectator'
  const isMyTurn = !isSpectator && turn === myMark
  const iVoted = myMark !== null && rematchVotes.includes(myMark)
  const opponentMark: Mark | null =
    myMark === 'X' ? 'O' : myMark === 'O' ? 'X' : null
  const opponentVoted =
    opponentMark !== null && rematchVotes.includes(opponentMark)

  return (
    <div className="flex flex-col items-center gap-3 min-h-20">
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
            <span
              style={{
                color: turn === 'X' ? 'var(--x-color)' : 'var(--o-color)',
              }}
            >
              {players[turn] || turn}
            </span>
            {isMyTurn ? (
              <span
                className="status-hint"
                style={{ marginLeft: '0.5rem', opacity: 0.5 }}
              >
                — TON TOUR
              </span>
            ) : isSpectator ? null : (
              <span
                className="status-hint"
                style={{ marginLeft: '0.5rem', opacity: 0.3 }}
              >
                joue...
              </span>
            )}
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
            <p
              className="status-winner"
              style={{
                color: winner === 'X' ? 'var(--x-color)' : 'var(--o-color)',
              }}
            >
              {players[winner] || winner} GAGNE
            </p>
          )}
          {!isSpectator && (
            <div className="flex flex-col items-center gap-2">
              {opponentVoted && !iVoted && (
                <p
                  className="font-mono text-[0.6rem] tracking-widest animate-pulse"
                  style={{
                    color:
                      opponentMark === 'X'
                        ? 'var(--x-color)'
                        : 'var(--o-color)',
                  }}
                >
                  {players[opponentMark!] || opponentMark} veut rejouer !
                </p>
              )}
              <button
                type="button"
                onClick={iVoted ? undefined : onRematch}
                disabled={iVoted}
                className="font-mono text-[0.7rem] tracking-[0.12em] border-2 bg-transparent transition-all duration-150 px-5 py-3.5 leading-none"
                style={
                  iVoted
                    ? {
                        borderColor: 'var(--border)',
                        color: 'var(--text-light)',
                        cursor: 'default',
                        opacity: 0.5,
                      }
                    : {
                        borderColor: 'var(--border)',
                        color: 'var(--muted-foreground)',
                        cursor: 'pointer',
                      }
                }
                onMouseEnter={
                  iVoted
                    ? undefined
                    : (e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = '#3A3A3A'
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          'var(--foreground)'
                      }
                }
                onMouseLeave={
                  iVoted
                    ? undefined
                    : (e) => {
                        ;(
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = 'var(--border)'
                        ;(e.currentTarget as HTMLButtonElement).style.color =
                          'var(--muted-foreground)'
                      }
                }
              >
                {iVoted ? 'EN ATTENTE...' : 'REVANCHE'}
              </button>
              {iVoted && !opponentVoted && (
                <p
                  className="font-mono text-[0.6rem] tracking-[0.1em]"
                  style={{ color: 'var(--text-light)', opacity: 0.5 }}
                >
                  En attente de {players[opponentMark!] || opponentMark}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {spectatorCount > 0 && (
        <p className="label-mono flex items-center gap-1.5">
          <Eye size={11} />
          <span>
            {spectatorCount} SPECTATEUR{spectatorCount > 1 ? 'S' : ''}
          </span>
        </p>
      )}
    </div>
  )
}
