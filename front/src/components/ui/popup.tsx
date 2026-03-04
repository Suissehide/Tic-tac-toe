import { cva, type VariantProps } from 'class-variance-authority'
import { FilePlus, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'
import { type ButtonProps, buttonVariants } from './button.tsx'

const popupVariants = cva(
  `fixed z-100 p-6 top-[20%] left-[50%] translate-x-[-50%] translate-y-[-20%] gap-4 bg-primary-foreground border border-border 
  rounded-md shadow-xl transition ease-in-out`,
  {
    variants: {
      size: {
        default: 'min-w-[400px]',
        lg: 'min-w-[50%]',
        xl: 'min-w-[80%]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

interface PopupTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Trigger>,
    ButtonProps {}

interface PopupContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof popupVariants> {}

const Popup = Dialog.Root
const PopupClose = Dialog.Close
const PopupPortal = Dialog.Portal

const PopupContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  PopupContentProps
>(({ className, size, children, ...props }, ref) => (
  <PopupPortal>
    <PopupOverlay />
    <PopupDescription />
    <Dialog.Content
      ref={ref}
      className={cn(popupVariants({ size }), className)}
      {...props}
    >
      {children}
      <PopupClose className="absolute right-4 top-4 rounded-full text-foreground bg-foreground/0 p-1 cursor-pointer ring-offset-background transition duration-300 hover:bg-primary/20 hover:text-primary focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </PopupClose>
    </Dialog.Content>
  </PopupPortal>
))
PopupContent.displayName = Dialog.Content.displayName

const PopupOverlay = React.forwardRef<
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
PopupOverlay.displayName = Dialog.Overlay.displayName

const PopupTrigger = React.forwardRef<
  React.ComponentRef<typeof Dialog.Trigger>,
  PopupTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <Dialog.Trigger
    ref={ref}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
))
PopupTrigger.displayName = Dialog.Trigger.displayName

const PopupHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pb-4 border-b border-border', className)}
    {...props}
  />
))
PopupHeader.displayName = 'PopupHeader'

const PopupTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, children, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn(
      'flex gap-5 items-center text-lg font-semibold m-0',
      className,
    )}
    {...props}
  >
    <div className="pl-2 relative flex justify-center items-center before:z-[-1] before:absolute before:bg-primary/30 before:rounded-full before:w-6.5 before:h-6.5 after:z-[-1] after:absolute after:bg-primary/10 after:rounded-full after:w-9.5 after:h-9.5">
      <FilePlus
        fill="#2563eb"
        strokeWidth={1}
        className="h-4 w-4 text-card z-1"
      />
    </div>
    {children}
  </Dialog.Title>
))
PopupTitle.displayName = 'PopupTitle'

const PopupDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
))
PopupDescription.displayName = 'PopupDescription'

const PopupBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('h-full py-4', className)} {...props} />
))
PopupBody.displayName = 'PopupBody'

const PopupFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex justify-between gap-2 pt-4 border-t border-border',
      className,
    )}
    {...props}
  />
))
PopupFooter.displayName = 'PopupFooter'

export {
  Popup,
  PopupHeader,
  PopupFooter,
  PopupTitle,
  PopupDescription,
  PopupContent,
  PopupBody,
  PopupTrigger,
}
