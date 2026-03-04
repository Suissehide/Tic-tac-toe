import { apiUrl } from '../constants/config.constant.ts'
import { handleHttpError } from '../libs/httpErrorHandler.ts'
import type { RegisterInput, User } from '../types/auth.ts'

export const AuthApi = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${apiUrl}/auth/sign-in`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      handleHttpError(
        response,
        {
          400: {
            title: 'Format invalide',
            message: 'Vérifie ton email et ton mot de passe',
          },
          401: {
            title: 'Identifiants incorrects',
            message: 'L’email ou le mot de passe est incorrect',
          },
        },
        'Impossible de se connecter',
      )
    }
    return response.json()
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${apiUrl}/auth/sign-out`, {
      method: 'POST',
    })
    if (!response.ok) {
      handleHttpError(
        response,
        {
          401: {
            title: 'Session expirée',
            message: 'Vous devez être connecté pour vous déconnecter',
          },
        },
        'Erreur lors de la déconnexion',
      )
    }
    return
  },

  refresh: async (): Promise<Response> => {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      handleHttpError(response, {}, 'Erreur lors de la mise à jour du cookie')
    }
    return response
  },

  register: async (registerInput: RegisterInput): Promise<Response> => {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInput),
    })
    if (!response.ok) {
      handleHttpError(
        response,
        {
          400: {
            title: 'Informations invalides',
            message: 'Certains champs sont incorrects ou manquants',
          },
          409: {
            title: 'Compte existant',
            message: 'Un utilisateur avec cet email existe déjà',
          },
        },
        'Erreur lors de l’inscription',
      )
    }
    return response
  },
}
