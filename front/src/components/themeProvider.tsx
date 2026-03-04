import { Theme, type ThemeProps } from '@radix-ui/themes'
import type { ReactNode } from 'react'

interface ThemeProviderProps extends ThemeProps {
  children: ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <Theme {...props}>{children}</Theme>
}
