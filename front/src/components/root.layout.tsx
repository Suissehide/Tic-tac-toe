import '../styles/_globals.css'

import { ToastProvider } from '@radix-ui/react-toast'
import type React from 'react'

import { ThemeProvider } from './themeProvider.tsx'
import { Toaster } from './ui/toaster.tsx'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      accentColor="mint"
      grayColor="gray"
      panelBackground="solid"
      scaling="100%"
      radius="medium"
    >
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  )
}
