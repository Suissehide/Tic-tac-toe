import { Cross2Icon } from '@radix-ui/react-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { Toast as ToastPrimitives } from 'radix-ui'
import React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../libs/utils.ts'

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return createPortal(
    <ToastPrimitives.Provider>{children}</ToastPrimitives.Provider>,
    document.body,
  )
}

const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[999] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'relative group flex w-full items-center justify-between space-x-3 overflow-hidden bg-card rounded-md p-4 pr-6 mt-4 shadow-xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'default',
        destructive:
          'destructive bg-[linear-gradient(to_right,_rgba(239,68,68,0.3)_1%,_transparent_40%,_transparent_100%)]',
        warning:
          'warning bg-[linear-gradient(to_right,_rgba(234,179,8,0.3)_1%,_transparent_40%,_transparent_100%)]',
        info: 'info bg-[linear-gradient(to_right,_rgba(59,130,246,0.3)_1%,_transparent_40%,_transparent_100%)]',
        success:
          'success bg-[linear-gradient(to_right,_rgba(16,185,129,0.3)_1%,_transparent_40%,_transparent_100%)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const toastIconVariants = cva(
  'relative flex justify-center items-center z-1 bg-background/40 rounded-full p-[7px] text-card before:-z-1 before:absolute before:bg-gray-700 before:p-2.5 before:rounded-full',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'before:bg-red-500',
        warning: 'before:bg-yellow-500',
        info: 'before:bg-blue-500',
        success: 'before:bg-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastIcon = ({
  className,
  children,
  variant,
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toastIconVariants>) => (
  <div className={cn(toastIconVariants({ variant }), className)}>
    {children}
  </div>
)

const ToastAction = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'cursor-pointer rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-700 focus:opacity-100 focus:outline-none group-hover:opacity-100',
      className,
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold [&+div]:text-xs', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
