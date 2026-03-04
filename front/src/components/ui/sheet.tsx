import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'
import { type ButtonProps, buttonVariants } from './button.tsx'

const Sheet = Dialog.Root

const sheetVariants = cva(
  'fixed z-100 gap-4 bg-primary-foreground border-border shadow-lg transition ease-in-out focus:outline-none focus:ring-0 focus-visible:outline-none ' +
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-[500px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right:
          'inset-y-0 right-0 h-full w-[500px] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Trigger>,
    ButtonProps {}

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof sheetVariants> {
  hasOverlay?: boolean
}

const SheetTrigger = React.forwardRef<
  React.ComponentRef<typeof Dialog.Trigger>,
  SheetTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <Dialog.Trigger
    ref={ref}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
))
SheetTrigger.displayName = Dialog.Trigger.displayName

const SheetClose = Dialog.Close
const SheetPortal = Dialog.Portal

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    className={cn(
      'fixed inset-0 z-50 cursor-pointer bg-background/1 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = Dialog.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(
  (
    { side = 'right', className, children, hasOverlay = true, ...props },
    ref,
  ) => (
    <SheetPortal>
      {hasOverlay && <SheetOverlay />}
      <SheetDescription />
      <Dialog.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-full bg-foreground/0 p-1 opacity-70 cursor-pointer ring-offset-background transition-opacity hover:opacity-100 hover:bg-foreground/20 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </Dialog.Content>
    </SheetPortal>
  ),
)
SheetContent.displayName = Dialog.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-4 pt-4 flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, children, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-sm', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))
SheetTitle.displayName = Dialog.Title.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
