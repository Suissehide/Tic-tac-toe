import { toSelectOptions } from '../libs/utils.ts'

export const ROLE = {
  NONE: 'Aucun',
  USER: 'Utilisateur',
  ADMIN: 'Administrateur',
}

export const ROLE_OPTIONS = toSelectOptions(ROLE)
