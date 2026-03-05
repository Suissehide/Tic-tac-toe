import { Outlet, createRootRoute } from '@tanstack/react-router'
import React from 'react'
import { environment } from '../constants/config.constant.ts'

const TanStackRouterDevtools =
  environment !== 'development'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

export const Route = createRootRoute({
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
