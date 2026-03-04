import { createFileRoute, redirect } from '@tanstack/react-router'
import { Lock } from 'lucide-react'

import { Button } from '../components/ui/button.tsx'
import { useLogout } from '../queries/useAuth.ts'

export const Route = createFileRoute('/pending')({
  beforeLoad: ({ context, location }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  shouldReload({ context }) {
    return (
      !context.authState.isAuthenticated ||
      context.authState.user?.role !== 'NONE'
    )
  },
  component: Pending,
})

function Pending() {
  const { logoutMutation } = useLogout()

  const handleLogout = () => {
    logoutMutation()
  }

  return (
    <div className="overflow-hidden w-full h-screen flex relative">
      <div className="absolute top-6 left-2">
        <h1 className="px-2 text-3xl font-bold">
          App
        </h1>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="z-10 w-[450px] top-1/2 -translate-y-1/2 bg-card/45 flex flex-col px-12 py-8 rounded-2xl border border-gray-100 backdrop-blur-sm absolute right-8">
          <div className="mb-6 flex justify-start">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="w-full text-2xl font-bold mb-6">
            Compte en attente d'approbation
          </h1>
          <p className="mb-6 text-muted-foreground">
            Votre compte a été créé mais n'a pas encore été activé. Veuillez
            contacter un administrateur pour obtenir l'accès au reste du site.
          </p>
          <div className="flex">
            <Button variant="default" onClick={() => handleLogout()}>
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Squares */}
      <div className="absolute left-[-10%] top-[200px] animate-bounce subtle-bounce">
        <div className=" rotate-[60deg] w-[500px] h-[500px] bg-gradient-to-b from-primary to-primary-foreground p-6 rounded-[5rem]" />
      </div>
      <div
        className="absolute right-[-15%] top-[-75px] animate-bounce subtle-bounce"
        style={{ animationDelay: '-1.7s' }}
      >
        <div className="rotate-[210deg] w-[500px] h-[500px] bg-gradient-to-b from-primary to-primary-foreground p-6 rounded-[5rem]" />
      </div>
    </div>
  )
}

export default Pending
