import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

import type { User } from '../types/auth.ts'

export interface AuthStoreState {
  isAuthenticated: boolean
  isInitialLoading: boolean
  user: User | null
}

export interface AuthStoreActions {
  update: (user: User) => void
  authenticate: (user: User | undefined) => void
  logout: () => void
}

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => ({
          isAuthenticated: false,
          isInitialLoading: false,
          user: null,

          update: (user: User | undefined) => {
            if (user) {
              set({ user })
            }
          },

          authenticate: (user: User | undefined) => {
            if (user) {
              set({ isAuthenticated: true, user })
            }
          },

          logout: () => {
            set({ isAuthenticated: false, user: null })
          },
        }),
        { name: 'auth-store' },
      ),
    ),
  ),
)
