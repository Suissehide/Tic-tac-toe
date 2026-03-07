import { useEffect, useState } from 'react'

interface ReconnectBannerProps {
  pseudo: string
  initialSeconds: number
}

export function ReconnectBanner({
  pseudo,
  initialSeconds,
}: ReconnectBannerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [initialSeconds])

  return (
    <div className="reconnect-banner">
      <div className="reconnect-timer">{secondsLeft}</div>
      <div>
        <p
          className="label-mono"
          style={{ color: 'var(--primary)', marginBottom: '0.2rem' }}
        >
          RECONNEXION EN COURS
        </p>
        <p style={{ fontSize: '0.85rem', color: '#A08040' }}>
          <strong style={{ color: '#E0B060' }}>{pseudo}</strong> s'est
          déconnecté
        </p>
      </div>
    </div>
  )
}
