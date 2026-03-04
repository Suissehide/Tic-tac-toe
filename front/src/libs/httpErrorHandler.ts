export type ApiErrorInfo = {
  title: string
  message: string
}
export type ErrorMessages = Partial<Record<number, ApiErrorInfo>>

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}

export function handleHttpError(
  response: Response,
  overrides: ErrorMessages = {},
  defaultMessage = 'Une erreur inconnue est survenue',
) {
  const status = response.status
  const custom = overrides[status]

  throw new ApiError(status, defaultMessage, custom)
}

export class ApiError extends Error {
  status: number
  title: string

  constructor(
    status: number,
    defaultMessage: string,
    override?: Partial<ApiErrorInfo>,
  ) {
    const base = ApiError.defaultErrorCases(status, defaultMessage)
    const final = {
      title: override?.title ?? defaultMessage ?? base.title,
      message: override?.message ?? base.message,
    }

    super(final.message)

    this.name = 'ApiError'
    this.status = status
    this.title = final.title
  }

  static defaultErrorCases(
    status: number,
    defaultMessage: string,
  ): ApiErrorInfo {
    switch (status) {
      case 0:
        return {
          title: 'Erreur de connexion',
          message:
            'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        }
      case 400:
        return {
          title: 'Requête invalide',
          message:
            'Le serveur n’a pas pu traiter la requête. Vérifiez les données envoyées.',
        }
      case 401:
        return {
          title: 'Non autorisé',
          message: 'Vous devez être connecté pour effectuer cette action.',
        }
      case 403:
        return {
          title: 'Accès interdit',
          message: 'Vous n’avez pas les permissions nécessaires.',
        }
      case 404:
        return {
          title: 'Introuvable',
          message: 'La ressource demandée est introuvable.',
        }
      case 500:
        return {
          title: 'Erreur serveur',
          message: 'Une erreur interne est survenue. Réessayez plus tard.',
        }
      default:
        return {
          title: 'Erreur',
          message: defaultMessage || 'Une erreur inconnue est survenue.',
        }
    }
  }
}
