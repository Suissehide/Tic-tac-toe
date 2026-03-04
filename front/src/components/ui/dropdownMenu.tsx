import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronRight, Dot } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils'

const dropdownMenuContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 slide-in-from-top-2',
)

interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>,
    VariantProps<typeof dropdownMenuContentVariants> {}

const DropdownMenuCustomContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 5, ...props }, ref) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownMenuContentVariants(), className)}
      {...props}
    />
  </DropdownMenu.Portal>
))
DropdownMenuCustomContent.displayName = 'DropdownMenuContent'

const DropdownMenuCustomItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm outline-none transition-colors hover:bg-primary/60 hover:text-accent-foreground focus:bg-primary/60 focus:text-accent-foreground',
      className,
    )}
    {...props}
  >
    {children}
  </DropdownMenu.Item>
))
DropdownMenuCustomItem.displayName = 'DropdownMenuItem'

const DropdownMenuCustomCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenu.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-primary hover:text-accent-foreground focus:bg-primary focus:text-accent-foreground',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </span>
    {children}
  </DropdownMenu.CheckboxItem>
))
DropdownMenuCustomCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

const DropdownMenuCustomRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-primary hover:text-accent-foreground focus:bg-primary focus:text-accent-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Dot className="h-4 w-4 fill-current" />
    </span>
    {children}
  </DropdownMenu.RadioItem>
))
DropdownMenuCustomRadioItem.displayName = 'DropdownMenuRadioItem'

const DropdownMenuCustomSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenu.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-primary focus:bg-primary',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenu.SubTrigger>
))
DropdownMenuCustomSubTrigger.displayName = 'DropdownMenuSubTrigger'

const DropdownMenuCustomSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenu.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 slide-in-from-left-1',
      className,
    )}
    {...props}
  />
))
DropdownMenuCustomSubContent.displayName = 'DropdownMenuSubContent'

export {
  DropdownMenuCustomContent,
  DropdownMenuCustomItem,
  DropdownMenuCustomCheckboxItem,
  DropdownMenuCustomRadioItem,
  DropdownMenuCustomSubTrigger,
  DropdownMenuCustomSubContent,
}
