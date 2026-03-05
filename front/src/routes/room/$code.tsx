import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
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
      navigate({ to: '/' })
    }
  }, [roomCode, code, navigate])

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const myMark: Mark | null = role === 'spectator' ? null : (role as Mark)
  const isMyTurn = myMark !== null && turn === myMark && status === 'playing'
  const isBlocked = !!disconnectedPlayer || !isMyTurn

  const handleLeave = () => {
    reset()
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Code :{' '}
          <span className="font-mono font-bold text-foreground tracking-widest">{code}</span>
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="px-2 py-0.5 rounded border text-xs hover:bg-muted"
        >
          Copier
        </button>
        <button
          type="button"
          onClick={handleLeave}
          className="px-2 py-0.5 rounded border text-xs hover:bg-muted ml-4"
        >
          Quitter
        </button>
      </div>

      {/* Players header */}
      <div className="flex items-center gap-4">
        <span className="text-blue-500 font-bold">{players.X || '?'} (X)</span>
        <span className="text-muted-foreground">vs</span>
        <span className="text-rose-500 font-bold">{players.O || '?'} (O)</span>
      </div>

      {/* Reconnect banner */}
      {disconnectedPlayer && (
        <ReconnectBanner
          pseudo={disconnectedPlayer.pseudo}
          initialSeconds={disconnectedPlayer.secondsLeft}
        />
      )}

      {/* Board */}
      <Board
        board={board}
        winLine={winLine}
        onCellClick={sendMove}
        disabled={isBlocked || role === 'spectator'}
        myMark={myMark}
        currentTurn={turn}
      />

      {/* Status */}
      <GameStatusBar
        status={status}
        turn={turn}
        players={players}
        winner={winner}
        role={role}
        myMark={myMark}
        spectatorCount={spectatorCount}
        onRematch={sendRematch}
      />

      {role === 'spectator' && (
        <p className="text-xs text-muted-foreground italic">Tu observes la partie</p>
      )}

      {pseudo && (
        <p className="text-xs text-muted-foreground">
          Connecté en tant que <strong>{pseudo}</strong>
          {myMark && ` (${myMark})`}
        </p>
      )}
    </div>
  )
}
