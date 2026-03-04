import { cva } from 'class-variance-authority'
import { Check, ChevronDown, X } from 'lucide-react'
import { Select as RadixUiSelect } from 'radix-ui'
import React from 'react'

import { cn } from '../../libs/utils.ts'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {}
export interface SelectProps extends RadixUiSelect.SelectProps {
  id: string
  options: { value: string | number; label: string }[]
  placeholder?: string
  className?: string
  clearable?: boolean
}
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 mb-0 text-sm transition-colors ' +
    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants(), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        rows={4}
        className={cn(inputVariants(), 'min-h-[75px]', className)}
        ref={ref}
        {...props}
      />
    )
  },
)
TextArea.displayName = 'TextArea'

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      placeholder,
      className,
      id,
      value,
      onValueChange,
      clearable = true,
      ...props
    },
    ref,
  ) => {
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      onValueChange?.('')
    }

    return (
      <div className="relative w-full">
        <RadixUiSelect.Root
          key={value}
          value={value}
          onValueChange={onValueChange}
          {...props}
        >
          <RadixUiSelect.Trigger
            ref={ref}
            className={cn(
              'inline-flex w-full h-[36px] items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm ' +
                'focus:outline-none focus:ring-1 focus:ring-ring',
              props.disabled
                ? 'bg-gray-200 text-gray-300'
                : 'cursor-pointer text-text',
              className,
            )}
          >
            <RadixUiSelect.Value placeholder={placeholder} />
            <RadixUiSelect.Icon asChild>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </RadixUiSelect.Icon>
          </RadixUiSelect.Trigger>

          <RadixUiSelect.Portal>
            <RadixUiSelect.Content
              id={id}
              position="popper"
              className="select-content z-150 rounded-md border border-border bg-white shadow-md"
            >
              <RadixUiSelect.Viewport className="p-1">
                {options.map((option) => (
                  <RadixUiSelect.Item
                    key={option.value}
                    value={option.value.toString()}
                    className="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm text-text hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <RadixUiSelect.ItemText>
                      {option.label}
                    </RadixUiSelect.ItemText>
                    <RadixUiSelect.ItemIndicator className="absolute right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </RadixUiSelect.ItemIndicator>
                  </RadixUiSelect.Item>
                ))}
              </RadixUiSelect.Viewport>
            </RadixUiSelect.Content>
          </RadixUiSelect.Portal>
        </RadixUiSelect.Root>

        {clearable && value !== '' && (
          <button
            type={'button'}
            onClick={handleClear}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="flex items-center mb-0 w-fit cursor-pointer select-none">
        <input type="checkbox" ref={ref} className="peer sr-only" {...props} />
        <div
          className={cn(
            'h-5 w-5 flex items-center justify-center rounded border border-border bg-background  transition-colors',
            ' peer-checked:[&>svg]:opacity-100',
            className,
          )}
          aria-hidden="true"
        >
          <Check className="h-5 w-5 text-primary opacity-0 transition-opacity pointer-events-none" />
        </div>
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Input, TextArea, Select, Checkbox }
