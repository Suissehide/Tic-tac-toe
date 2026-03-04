import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }

    if (
      !context.authState.user?.role ||
      context.authState.user?.role === 'NONE'
    ) {
      throw redirect({
        to: '/pending',
      })
    }
  },
  shouldReload({ context }) {
    return (
      !context.authState.isAuthenticated ||
      context.authState.user?.role === 'NONE'
    )
  },
  component: () => <Outlet />,
})
