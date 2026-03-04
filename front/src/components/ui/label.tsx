import { cva, type VariantProps } from 'class-variance-authority'
import { Label as LabelPrimitive } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'

const labelVariants = cva(
  'text-sm text-text-light font-semilight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, htmlFor, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    htmlFor={htmlFor}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { labelVariants, Label }
