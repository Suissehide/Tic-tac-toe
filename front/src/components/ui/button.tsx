import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../../libs/utils'

const buttonVariants = cva(
  'inline-flex gap-1.5 items-center justify-center rounded-md text-sm font-bold cursor-pointer duration-150 transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/70',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/70',
        outline:
          'border border-border bg-transparent hover:bg-card hover:text-text-light',
        secondary: 'bg-secondary text-text shadow-sm hover:bg-border',
        ghost:
          'bg-card border border-muted hover:text-primary hover:border-primary/20',
        link: 'text-primary underline-offset-4 hover:underline',
        none: 'text-primary bg-transparent border-none shadow-none p-0 hover:bg-primary/20',
        transparent:
          'text-primary bg-transparent border-none shadow-none p-0 focus-visible:ring-0',
        absolute:
          'absolute right-2 text-primary bg-transparent border-none shadow-none p-0 hover:bg-primary/20',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9 rounded-lg',
        'icon-sm': 'h-6 w-6 p-1 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
