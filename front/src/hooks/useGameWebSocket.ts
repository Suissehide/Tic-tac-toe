import { useEffect, useRef } from 'react'
import { getWsUrl } from '../api/game.api'
import { useGameStore, type ServerMessage } from '../store/useGameStore'

export function useGameWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const { roomCode, playerId, pseudo, role, applyMessage } = useGameStore()

  useEffect(() => {
    if (!roomCode || !playerId) return

    const spectator = role === 'spectator'
    const url = getWsUrl(roomCode, playerId, pseudo, spectator)
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data as string)
        applyMessage(msg)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onerror = () => {
      console.error('WebSocket error')
    }

    ws.onclose = () => {
      clearInterval(pingInterval)
    }

    // Keepalive ping every 25s
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 25_000)

    return () => {
      clearInterval(pingInterval)
      ws.close()
    }
  }, [roomCode, playerId, pseudo, role, applyMessage])

  const sendMove = (index: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'game:move', index }))
    }
  }

  const sendRematch = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'game:rematch' }))
    }
  }

  return { sendMove, sendRematch }
}
