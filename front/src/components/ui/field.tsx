import { Form } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'
import { inputVariants } from './input.tsx'
import { labelVariants } from './label.tsx'

export interface FieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Field = React.forwardRef<
  React.ComponentRef<typeof Form.Field>,
  FieldProps
>(({ className, type, name = 'default', label, required, ...props }, ref) => (
  <Form.Field ref={ref} name={name} className={cn('', className)} {...props}>
    <Label>{label}</Label>
    <Control type={type} required={required} {...props} />
  </Form.Field>
))
Field.displayName = Form.Field.displayName

const Label = React.forwardRef<
  React.ComponentRef<typeof Form.Label>,
  React.ComponentPropsWithoutRef<typeof Form.Label>
>(({ className, ...props }, ref) => (
  <Form.Label ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = Form.Label.displayName

const Message = React.forwardRef<
  React.ComponentRef<typeof Form.Message>,
  FieldProps
>(({ className, ...props }, ref) => (
  <Form.Message ref={ref} className={cn('', className)} {...props} />
))
Message.displayName = Form.Message.displayName

const Control = React.forwardRef<
  React.ComponentRef<typeof Form.Control>,
  FieldProps
>(({ className, type, required, ...props }, ref) => (
  <Form.Control
    ref={ref}
    type={type}
    required={required}
    className={cn(inputVariants(), className)}
    {...props}
  />
))
Control.displayName = Form.Control.displayName

export { Field }
