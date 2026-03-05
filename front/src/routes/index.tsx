import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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

  const playerId = getOrCreatePlayerId()

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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-2xl border bg-card shadow-sm">
        <h1 className="text-3xl font-bold text-center">Tic-tac-toe</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pseudo</label>
          <Input
            placeholder="Ton pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={20}
          />
        </div>

        <Button className="w-full" onClick={handleCreate} disabled={loading}>
          Créer une partie
        </Button>

        <div className="relative flex items-center gap-2">
          <div className="flex-1 border-t" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 border-t" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Code de room</label>
          <Input
            placeholder="ABC123"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleJoin} disabled={loading}>
            Rejoindre
          </Button>
          <Button variant="outline" onClick={handleSpectate} disabled={loading}>
            Observer
          </Button>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  )
}
