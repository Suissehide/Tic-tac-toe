import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Eye, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { createRoom, joinRoom } from '../api/game.api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label.tsx'
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

  const [pseudo, setPseudo] = useState(
    () => localStorage.getItem('ttt-pseudo') ?? '',
  )
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [playerId] = useState(() => getOrCreatePlayerId())

  const handleCreate = async () => {
    if (!pseudo.trim()) {
      setError('Saisis un pseudo')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { roomCode } = await createRoom(pseudo.trim(), playerId)
      localStorage.setItem('ttt-pseudo', pseudo.trim())
      localStorage.setItem('ttt-room-role', 'X')
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
    if (!pseudo.trim()) {
      setError('Saisis un pseudo')
      return
    }
    if (!joinCode.trim()) {
      setError('Saisis un code de room')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await joinRoom(
        joinCode.trim().toUpperCase(),
        pseudo.trim(),
        playerId,
      )
      localStorage.setItem('ttt-pseudo', pseudo.trim())
      localStorage.setItem('ttt-room-role', data.role)
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
    if (!joinCode.trim()) {
      setError('Saisis un code de room')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await joinRoom(
        joinCode.trim().toUpperCase(),
        pseudo.trim() || 'Spectateur',
        playerId,
        true,
      )
      localStorage.setItem('ttt-pseudo', pseudo.trim() || 'Spectateur')
      localStorage.setItem('ttt-room-role', 'spectator')
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background decorative board */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]"
        aria-hidden
      >
        <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 w-[min(80vw,80vh)] h-[min(80vw,80vh)]">
          {['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'].map((id) => (
            <div key={id} className="bg-background" />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Title */}
        <div className="mb-8 animate-appear-1">
          <h1 className="font-display leading-none select-none text-foreground tracking-[-0.01em] text-[clamp(3.5rem,15vw,5rem)]">
            TIC
            <br />
            <span className="text-x">TAC</span>
            <br />
            TOE
          </h1>
          <p className="label-mono mt-3">
            MULTIJOUEUR · TEMPS RÉEL · STRATÉGIE
          </p>
        </div>

        {/* Identity — champ partagé entre créer et rejoindre */}
        <div className="animate-appear-2 mb-4 p-4 bg-board-cell border border-border">
          <Label className="label-mono block mb-2 text-text-light">
            TON PSEUDO
          </Label>
          <Input
            variant="game"
            placeholder="Entrer un pseudo…"
            value={pseudo}
            maxLength={20}
            onChange={(e) => setPseudo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>

        {/* Actions — deux blocs côte à côte */}
        <div className="grid grid-cols-2 gap-2 animate-appear-3">
          {/* Créer */}
          <div className="p-4 flex flex-col justify-between gap-4 bg-board-cell border border-border">
            <span className="label-mono">NOUVELLE PARTIE</span>
            <Button
              type="button"
              variant="game-primary"
              className="w-full"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? (
                '…'
              ) : (
                <>
                  <span>CRÉER</span>
                  <ArrowRight size={13} />
                </>
              )}
            </Button>
          </div>

          {/* Rejoindre */}
          <div className="p-4 flex flex-col gap-3 bg-board-cell border border-border">
            <span className="label-mono">REJOINDRE</span>
            <Input
              variant="game-mono"
              placeholder="ABC123"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="game-danger"
                className="flex-1"
                onClick={handleJoin}
                disabled={loading}
              >
                {loading ? '…' : 'JOIN'}
              </Button>
              <Button
                type="button"
                variant="game-ghost"
                onClick={handleSpectate}
                disabled={loading}
                title="Observer la partie"
              >
                <Eye size={13} />
              </Button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 animate-appear-1 label-mono flex items-center gap-1.5 text-secondary">
            <TriangleAlert size={12} /> {error.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  )
}
