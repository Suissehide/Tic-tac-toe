import { apiUrl } from '../constants/config.constant'

export interface CreateRoomResponse {
  roomCode: string
}

export interface JoinRoomResponse {
  role: 'X' | 'O' | 'spectator'
  roomCode: string
  players: Record<string, string>
  status: string
}

export async function createRoom(pseudo: string, playerId: string): Promise<CreateRoomResponse> {
  const res = await fetch(`${apiUrl}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pseudo, playerId }),
  })
  if (!res.ok) throw new Error('Failed to create room')
  return res.json()
}

export async function joinRoom(
  code: string,
  pseudo: string,
  playerId: string,
  spectator = false,
): Promise<JoinRoomResponse> {
  const res = await fetch(`${apiUrl}/rooms/${code}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pseudo, playerId, spectator }),
  })
  if (res.status === 404) throw new Error('Room not found')
  if (res.status === 409) throw new Error('Room is full')
  if (!res.ok) throw new Error('Failed to join room')
  return res.json()
}

export function getWsUrl(code: string, playerId: string, pseudo: string, spectator: boolean): string {
  const base = apiUrl.replace(/^http/, 'ws')
  const params = new URLSearchParams({ playerId, pseudo, spectator: String(spectator) })
  return `${base}/rooms/${code}/ws?${params}`
}
