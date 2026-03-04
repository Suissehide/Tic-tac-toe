import { Popover } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'

const PopoverRoot = Popover.Root
const PopoverTrigger = Popover.Trigger
const PopoverAnchor = Popover.Anchor
const PopoverPortal = Popover.Portal
const PopoverClose = Popover.Close

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <PopoverPortal>
    <Popover.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={16}
      className={cn(
        'z-100 w-72 rounded-lg border border-border bg-background p-4 shadow-xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
        className,
      )}
      {...props}
    >
      {children}
      <PopoverArrow />
    </Popover.Content>
  </PopoverPortal>
))
PopoverContent.displayName = Popover.Content.displayName

const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof Popover.Arrow>,
  React.ComponentPropsWithoutRef<typeof Popover.Arrow>
>(({ className, ...props }, ref) => (
  <Popover.Arrow
    ref={ref}
    className={cn(
      'fill-background drop-shadow-[0_1px_0_var(--border)]',
      className,
    )}
    width={12}
    height={6}
    {...props}
  />
))
PopoverArrow.displayName = Popover.Arrow.displayName

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverArrow,
}
