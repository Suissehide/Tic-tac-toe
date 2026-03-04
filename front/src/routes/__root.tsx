import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import React from 'react'
import type { AuthState } from '../types/auth.ts'
import type { QueryClient } from '@tanstack/react-query'
import { environment } from '../constants/config.constant.ts'

const TanStackRouterDevtools =
  environment !== 'development'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

type RouterContext = {
  queryClient: QueryClient
  authState: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
})

function Root() {
  return (
    <>
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-left" />
      </React.Suspense>
    </>
  )
}
