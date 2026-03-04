import type { UserDTO } from './user.domain.interface'

export type CreateUserInput = {
  email: string
  password: string
  firstName?: string
  lastName?: string
}
export type SignInResponse = {
  accessToken: string
  refreshToken: string
} & UserDTO
export type SignOutResponse = {
  success: boolean
}
export type RegisterResponse = {
  success: boolean
}

export interface AuthDomainInterface {
  signIn: (authCode: string, redirectUri: string) => Promise<SignInResponse>
  refresh: (refreshToken: string) => Promise<SignInResponse>
  signOut: () => SignOutResponse
  register: (createUserInput: CreateUserInput) => Promise<RegisterResponse>
}
