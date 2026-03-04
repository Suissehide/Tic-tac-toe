import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '../../components/ui/button.tsx'
import { useAppForm } from '../../hooks/formConfig.tsx'
import { useLogin, useRegister } from '../../queries/useAuth.ts'

export const Route = createFileRoute('/auth/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()

  const { loginMutation, isPending: isLoginPending } = useLogin()
  const { registerMutation, isPending: isRegisterPending } = useRegister()

  const [mode, setMode] = useState<'login' | 'register'>('login')

  // Form de connexion
  const loginForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      loginMutation(
        { email: value.email, password: value.password },
        {
          onSuccess: async () => {
            const redirect = new URLSearchParams(window.location.search).get(
              'redirect',
            )
            await navigate({ to: redirect || '/' })
          },
        },
      )
    },
  })

  // Form d'inscription
  const registerForm = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        if (value.password !== value.confirmPassword) {
          return {
            form: 'Les mots de passe ne correspondent pas',
            fields: {
              confirmPassword: 'Les mots de passe ne correspondent pas',
            },
          }
        }
        return undefined
      },
    },
    onSubmit: ({ value }) => {
      registerMutation(
        {
          email: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
        },
        {
          onSuccess: () => {
            setMode('login')
            registerForm.reset()
          },
        },
      )
    },
  })

  const toggleLogin = () => {
    loginForm.reset()
    setMode('login')
  }

  const toggleRegister = () => {
    registerForm.reset()
    setMode('register')
  }

  return (
    <div className="overflow-hidden w-full h-screen flex relative">
      <div className="absolute top-6 left-2">
        <h1 className="px-2 text-3xl font-bold">
          App
        </h1>
      </div>

      <div className="flex-1 flex justify-end">
        {/* Login Card */}
        <div
          className={`z-10 w-[450px] top-1/2 -translate-y-1/2 bg-card/45 flex flex-col items-center px-12 py-8 rounded-2xl border border-gray-100 backdrop-blur-sm absolute transition-all duration-700 ease-in-out ${
            mode === 'login'
              ? 'right-8'
              : 'right-[-600px] opacity-0 pointer-events-none'
          }`}
        >
          <h2 className="text-left w-full text-2xl font-bold mb-8">
            S'identifier
          </h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await loginForm.handleSubmit()
            }}
            className="w-full flex flex-col gap-2"
          >
            <loginForm.AppField name="email">
              {(field) => <field.Input type="email" label="Email" />}
            </loginForm.AppField>

            <loginForm.AppField name="password">
              {(field) => <field.Password label="Mot de passe" />}
            </loginForm.AppField>

            <div className="w-full text-right -mt-2">
              <button
                type="button"
                className="cursor-pointer text-sm text-text-light"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoginPending}
            >
              {isLoginPending ? 'Connexion...' : "S'identifier"}
            </Button>
          </form>

          <div className="text-sm text-text-light mt-4 text-center">
            Vous n'avez pas de compte ?{' '}
            <button
              type="button"
              onClick={toggleRegister}
              className="cursor-pointer text-primary hover:underline font-semibold"
            >
              Inscrivez-vous ici
            </button>
          </div>
        </div>

        {/* Register Card */}
        <div
          className={`z-10 w-[450px] top-1/2 -translate-y-1/2 bg-card/35 flex flex-col items-center px-12 py-8 rounded-2xl border border-gray-100 backdrop-blur-sm absolute transition-all duration-700 ease-in-out ${
            mode === 'register'
              ? 'right-8'
              : 'right-[-600px] opacity-0 pointer-events-none'
          }`}
        >
          <h2 className="text-left w-full text-2xl font-bold mb-4">
            S'inscrire
          </h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await registerForm.handleSubmit()
            }}
            className="w-full flex flex-col gap-2"
          >
            <registerForm.AppField name="email">
              {(field) => <field.Input label="Email" />}
            </registerForm.AppField>

            <registerForm.AppField name="firstName">
              {(field) => <field.Input label="Prénom" />}
            </registerForm.AppField>

            <registerForm.AppField name="lastName">
              {(field) => <field.Input label="Nom" />}
            </registerForm.AppField>

            <registerForm.AppField name="password">
              {(field) => <field.Password label="Mot de passe" />}
            </registerForm.AppField>

            <registerForm.AppField name="confirmPassword">
              {(field) => <field.Password label="Confirmer le mot de passe" />}
            </registerForm.AppField>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isRegisterPending}
            >
              {isRegisterPending ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>

          <div className="text-sm text-text-light mt-4 text-center">
            Vous avez déjà un compte ?{' '}
            <button
              type="button"
              onClick={toggleLogin}
              className="cursor-pointer text-primary hover:underline font-semibold"
            >
              Connectez-vous ici
            </button>
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
    </div>
  )
}

export default Index
