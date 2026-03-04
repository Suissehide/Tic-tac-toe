import { Switch as RadixUiSwitch } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'

const Switch = React.forwardRef<
  React.ComponentRef<typeof RadixUiSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RadixUiSwitch.Root>
>(({ className, ...props }, ref) => (
  <RadixUiSwitch.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200',
      className,
    )}
    {...props}
  >
    <RadixUiSwitch.Thumb
      className={cn(
        'pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform',
        'data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0',
      )}
    />
  </RadixUiSwitch.Root>
))
Switch.displayName = RadixUiSwitch.Root.displayName

export { Switch }
