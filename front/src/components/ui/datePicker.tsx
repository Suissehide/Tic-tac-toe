import {
  DatePicker as MuiDatePicker,
  type DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers'
import { clsx } from 'clsx'

interface DatePickerProps extends MuiDatePickerProps {
  className?: string
  inputClassName?: string
  label?: string
}

export const DatePicker = ({
  value,
  onChange,
  label,
  className = '',
  ...props
}: DatePickerProps) => {
  return (
    <MuiDatePicker
      value={value}
      onChange={onChange}
      label={label}
      {...props}
      slotProps={{
        textField: {
          variant: 'outlined',
          InputProps: {
            className: clsx(
              'h-[36px] text-sm bg-background border border-border rounded-md shadow-none',
              className,
            ),
            classes: {
              notchedOutline: 'border-none',
            },
          },
        },
      }}
    />
  )
}
