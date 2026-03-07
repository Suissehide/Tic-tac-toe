import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check, Clipboard, Eye, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Board } from '../../components/game/Board'
import { GameStatusBar } from '../../components/game/GameStatus'
import { PlayerBadge } from '../../components/game/PlayerBadge'
import { ReconnectBanner } from '../../components/game/ReconnectBanner'
import { Button } from '../../components/ui/button'
import { useGameWebSocket } from '../../hooks/useGameWebSocket'
import type { Mark, Role } from '../../store/useGameStore'
import { useGameStore } from '../../store/useGameStore'

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
    moveHistory,
    disconnectedPlayer,
    rematchVotes,
    reset,
    setIdentity,
    setRoom,
  } = useGameStore()

  const { sendMove, sendRematch } = useGameWebSocket()

  useEffect(() => {
    if (roomCode && roomCode === code) {
      return
    }

    const savedPlayerId = localStorage.getItem('ttt-player-id')
    const savedPseudo = localStorage.getItem('ttt-pseudo')
    const savedRole = localStorage.getItem('ttt-room-role') as Role | null

    if (
      savedPlayerId &&
      savedPseudo &&
      (savedRole === 'X' || savedRole === 'O' || savedRole === 'spectator')
    ) {
      setIdentity(savedPseudo, savedPlayerId)
      setRoom(code, savedRole)
    } else {
      void navigate({ to: '/' })
    }
  }, [roomCode, code, navigate, setIdentity, setRoom])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleLeave = () => {
    localStorage.removeItem('ttt-room-role')
    reset()
    void navigate({ to: '/' })
  }

  const myMark: Mark | null = role === 'spectator' ? null : (role as Mark)
  const isMyTurn = myMark !== null && turn === myMark && status === 'playing'
  const isBlocked = !!disconnectedPlayer || !isMyTurn

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border animate-appear-1">
        {/* Room code */}
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-3 group"
          title="Copier le code"
        >
          <span className="label-mono">ROOM</span>
          <span className="room-code group-hover:opacity-70">{code}</span>
          <span
            className="label-mono transition-all duration-200 flex items-center gap-1 px-2 py-[0.2rem]"
            style={{
              background: copied ? '#1A2400' : 'var(--muted)',
              color: copied ? '#6ECC00' : 'var(--text-light)',
              border: `1px solid ${copied ? '#3A5000' : 'var(--border)'}`,
            }}
          >
            {copied ? (
              <>
                <Check size={10} /> COPIÉ
              </>
            ) : (
              <>
                <Clipboard size={10} /> COPIER
              </>
            )}
          </span>
        </button>

        {/* Leave */}
        <Button
          type="button"
          variant="game-ghost"
          className="px-3 py-1.5 text-[0.6rem]"
          onClick={handleLeave}
        >
          <LogOut size={12} /> QUITTER
        </Button>
      </header>

      {/* ── Players bar ─────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border animate-appear-2">
        <PlayerBadge
          mark="X"
          name={players.X}
          isActive={status === 'playing' && turn === 'X'}
        />

        <span className="label-mono" style={{ color: 'var(--border)' }}>
          VS
        </span>

        <PlayerBadge
          mark="O"
          name={players.O}
          isActive={status === 'playing' && turn === 'O'}
          reversed
        />

        {spectatorCount > 0 && (
          <span
            className="label-mono ml-auto flex items-center gap-1"
            style={{ color: 'var(--text-light)' }}
          >
            <Eye size={11} /> {spectatorCount}
          </span>
        )}
      </div>

      {/* ── Main game area ──────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-8">
        {disconnectedPlayer && (
          <div className="animate-appear-1">
            <ReconnectBanner
              pseudo={disconnectedPlayer.pseudo}
              initialSeconds={disconnectedPlayer.secondsLeft}
            />
          </div>
        )}

        <div className="animate-appear-2">
          <Board
            board={board}
            winLine={winLine}
            moveHistory={moveHistory}
            onCellClick={sendMove}
            disabled={isBlocked || role === 'spectator'}
            myMark={myMark}
            currentTurn={turn}
          />
        </div>

        <div className="animate-appear-3">
          <GameStatusBar
            status={status}
            turn={turn}
            players={players}
            winner={winner}
            role={role}
            myMark={myMark}
            spectatorCount={0}
            rematchVotes={rematchVotes}
            onRematch={sendRematch}
          />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="flex items-center justify-center gap-2 px-5 py-3 border-t border-border">
        {pseudo && (
          <p className="label-mono" style={{ color: 'var(--text-light)' }}>
            {pseudo}
            {myMark && (
              <span
                style={{
                  color: myMark === 'X' ? 'var(--x-color)' : 'var(--o-color)',
                  marginLeft: '0.5rem',
                }}
              >
                ({myMark})
              </span>
            )}
            {role === 'spectator' && (
              <span style={{ marginLeft: '0.5rem' }}>· SPECTATEUR</span>
            )}
          </p>
        )}
      </footer>
    </div>
  )
}
