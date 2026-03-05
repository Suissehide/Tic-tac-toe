import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createRoom, joinRoom } from '../api/game.api'
import { useGameStore } from '../store/useGameStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem('ttt-player-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('ttt-player-id', id)
  }
  return id
}

function HomePage() {
  const navigate = useNavigate()
  const setIdentity = useGameStore((s) => s.setIdentity)
  const setRoom = useGameStore((s) => s.setRoom)

  const [pseudo, setPseudo] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [playerId] = useState(() => getOrCreatePlayerId())

  const handleCreate = async () => {
    if (!pseudo.trim()) { setError('Saisis un pseudo'); return }
    setLoading(true)
    setError('')
    try {
      const { roomCode } = await createRoom(pseudo.trim(), playerId)
      setIdentity(pseudo.trim(), playerId)
      setRoom(roomCode, 'X')
      await navigate({ to: '/room/$code', params: { code: roomCode } })
    } catch {
      setError('Impossible de créer la partie')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!pseudo.trim()) { setError('Saisis un pseudo'); return }
    if (!joinCode.trim()) { setError('Saisis un code de room'); return }
    setLoading(true)
    setError('')
    try {
      const data = await joinRoom(joinCode.trim().toUpperCase(), pseudo.trim(), playerId)
      setIdentity(pseudo.trim(), playerId)
      setRoom(data.roomCode, data.role)
      await navigate({ to: '/room/$code', params: { code: data.roomCode } })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleSpectate = async () => {
    if (!joinCode.trim()) { setError('Saisis un code de room'); return }
    setLoading(true)
    setError('')
    try {
      const data = await joinRoom(joinCode.trim().toUpperCase(), pseudo.trim() || 'Spectateur', playerId, true)
      setIdentity(pseudo.trim() || 'Spectateur', playerId)
      setRoom(data.roomCode, 'spectator')
      await navigate({ to: '/room/$code', params: { code: data.roomCode } })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Room introuvable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--background)' }}>

      {/* Background decorative board */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
        style={{ opacity: 0.025 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            background: '#fff',
            padding: '6px',
            width: 'min(80vw, 80vh)',
            height: 'min(80vw, 80vh)',
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--background)' }} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs relative z-10">

        {/* Title */}
        <div className="mb-10 appear-1">
          <h1
            className="leading-none select-none"
            style={{
              fontFamily: 'Russo One, sans-serif',
              fontSize: 'clamp(3.5rem, 15vw, 5rem)',
              color: 'var(--foreground)',
              letterSpacing: '-0.01em',
            }}
          >
            TIC<br />
            <span style={{ color: 'var(--x-color)' }}>TAC</span><br />
            TOE
          </h1>
          <p className="label-mono mt-3">MULTIJOUEUR · TEMPS RÉEL · ANONYME</p>
        </div>

        {/* Pseudo */}
        <div className="mb-5 appear-2">
          <label className="label-mono block mb-2">TON PSEUDO</label>
          <input
            className="game-input"
            placeholder="Entrer un pseudo…"
            value={pseudo}
            maxLength={20}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>

        {/* Create button */}
        <div className="mb-8 appear-3">
          <button
            type="button"
            className="game-btn game-btn--primary w-full"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? '…' : 'CRÉER UNE PARTIE →'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6 appear-4">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="label-mono">OU</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Join code */}
        <div className="mb-4 appear-4">
          <label className="label-mono block mb-2">CODE DE ROOM</label>
          <input
            className="game-input game-input--mono"
            placeholder="ABC123"
            value={joinCode}
            maxLength={6}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
        </div>

        {/* Join + Spectate */}
        <div className="flex gap-2 appear-5">
          <button
            type="button"
            className="game-btn game-btn--danger flex-1"
            onClick={handleJoin}
            disabled={loading}
          >
            REJOINDRE
          </button>
          <button
            type="button"
            className="game-btn game-btn--ghost"
            onClick={handleSpectate}
            disabled={loading}
            title="Observer la partie"
          >
            👁 OBS.
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            className="mt-4 appear-1"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              color: 'var(--secondary)',
            }}
          >
            ⚠ {error.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  )
}
