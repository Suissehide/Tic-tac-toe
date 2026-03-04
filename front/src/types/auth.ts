export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: Role
}

export type Role = 'NONE' | 'USER' | 'ADMIN'

export type AuthState = {
  isAuthenticated: boolean
  user: User | null
}

export type RegisterInput = Pick<User, 'email' | 'firstName' | 'lastName'> & {
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type UpdateUserParams = {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  role?: Role
}
