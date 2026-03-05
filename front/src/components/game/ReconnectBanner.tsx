import { useEffect, useState } from 'react'

interface ReconnectBannerProps {
  pseudo: string
  initialSeconds: number
}

export function ReconnectBanner({ pseudo, initialSeconds }: ReconnectBannerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [initialSeconds])

  return (
    <div className="px-4 py-2 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm text-center">
      <strong>{pseudo}</strong> s'est déconnecté — attente de reconnexion ({secondsLeft}s)...
    </div>
  )
}
