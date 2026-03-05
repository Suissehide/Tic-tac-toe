import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Board } from '../../components/game/Board'
import { GameStatusBar } from '../../components/game/GameStatus'
import { ReconnectBanner } from '../../components/game/ReconnectBanner'
import { useGameWebSocket } from '../../hooks/useGameWebSocket'
import { useGameStore } from '../../store/useGameStore'
import type { Mark } from '../../store/useGameStore'

export const Route = createFileRoute('/room/$code')({
  component: RoomPage,
})

function RoomPage() {
  const { code } = Route.useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const {
    roomCode,
    role,
    pseudo,
    board,
    turn,
    status,
    players,
    spectatorCount,
    winner,
    winLine,
    disconnectedPlayer,
    reset,
  } = useGameStore()

  const { sendMove, sendRematch } = useGameWebSocket()

  useEffect(() => {
    if (!roomCode || roomCode !== code) {
      void navigate({ to: '/' })
    }
  }, [roomCode, code, navigate])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleLeave = () => {
    reset()
    void navigate({ to: '/' })
  }

  const myMark: Mark | null = role === 'spectator' ? null : (role as Mark)
  const isMyTurn = myMark !== null && turn === myMark && status === 'playing'
  const isBlocked = !!disconnectedPlayer || !isMyTurn

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* ── Top bar ─────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-5 py-3 appear-1"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Room code */}
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-3 group"
          title="Copier le code"
        >
          <span className="label-mono">ROOM</span>
          <span
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '1.1rem',
              letterSpacing: '0.25em',
              color: 'var(--x-color)',
              transition: 'opacity 0.15s',
            }}
            className="group-hover:opacity-70"
          >
            {code}
          </span>
          <span
            className="label-mono transition-all duration-200"
            style={{
              padding: '0.2rem 0.5rem',
              background: copied ? '#1A2400' : 'var(--muted)',
              color: copied ? '#6ECC00' : 'var(--text-light)',
              border: `1px solid ${copied ? '#3A5000' : 'var(--border)'}`,
            }}
          >
            {copied ? '✓ COPIÉ' : 'COPIER'}
          </span>
        </button>

        {/* Leave */}
        <button
          type="button"
          className="game-btn game-btn--ghost"
          style={{ padding: '0.3rem 0.75rem', fontSize: '0.6rem' }}
          onClick={handleLeave}
        >
          QUITTER
        </button>
      </header>

      {/* ── Players bar ─────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-2.5 appear-2"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* X player */}
        <div className="flex items-center gap-1.5">
          <span
            style={{
              fontFamily: 'Russo One, sans-serif',
              fontSize: '0.95rem',
              color: 'var(--x-color)',
              letterSpacing: '0.03em',
            }}
          >
            {players.X || '?'}
          </span>
          <span className="label-mono" style={{ color: 'var(--x-color)', opacity: 0.5 }}>X</span>
          {status === 'playing' && turn === 'X' && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--x-color)' }}
            />
          )}
        </div>

        <span className="label-mono" style={{ color: 'var(--border)' }}>VS</span>

        {/* O player */}
        <div className="flex items-center gap-1.5">
          {status === 'playing' && turn === 'O' && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--o-color)' }}
            />
          )}
          <span className="label-mono" style={{ color: 'var(--o-color)', opacity: 0.5 }}>O</span>
          <span
            style={{
              fontFamily: 'Russo One, sans-serif',
              fontSize: '0.95rem',
              color: 'var(--o-color)',
              letterSpacing: '0.03em',
            }}
          >
            {players.O || '?'}
          </span>
        </div>

        {/* Spectators */}
        {spectatorCount > 0 && (
          <span className="label-mono ml-auto" style={{ color: 'var(--text-light)' }}>
            👁 {spectatorCount}
          </span>
        )}
      </div>

      {/* ── Main game area ──────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-8">

        {/* Reconnect banner */}
        {disconnectedPlayer && (
          <div className="appear-1">
            <ReconnectBanner
              pseudo={disconnectedPlayer.pseudo}
              initialSeconds={disconnectedPlayer.secondsLeft}
            />
          </div>
        )}

        {/* Board */}
        <div className="appear-2">
          <Board
            board={board}
            winLine={winLine}
            onCellClick={sendMove}
            disabled={isBlocked || role === 'spectator'}
            myMark={myMark}
            currentTurn={turn}
          />
        </div>

        {/* Status */}
        <div className="appear-3">
          <GameStatusBar
            status={status}
            turn={turn}
            players={players}
            winner={winner}
            role={role}
            myMark={myMark}
            spectatorCount={0}
            onRematch={sendRematch}
          />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        className="flex items-center justify-center gap-2 px-5 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {pseudo && (
          <p className="label-mono" style={{ color: 'var(--text-light)' }}>
            {pseudo}
            {myMark && (
              <span style={{ color: myMark === 'X' ? 'var(--x-color)' : 'var(--o-color)', marginLeft: '0.5rem' }}>
                ({myMark})
              </span>
            )}
            {role === 'spectator' && <span style={{ marginLeft: '0.5rem' }}>· SPECTATEUR</span>}
          </p>
        )}
      </footer>
    </div>
  )
}
