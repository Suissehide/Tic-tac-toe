import { clsx } from 'clsx'
import {
  TimePicker as MuiTimePicker,
  type TimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers'

interface TimePickerProps extends MuiTimePickerProps {
  className?: string
  inputClassName?: string
  label?: string
}

export const TimePicker = ({
  value,
  onChange,
  label,
  className = '',
  ...props
}: TimePickerProps) => {
  return (
    <MuiTimePicker
      value={value}
      onChange={onChange}
      label={label}
      ampm={false}
      {...props}
      slotProps={{
        popper: {
          disablePortal: true,
          modifiers: [
            {
              name: 'preventOverflow',
              enabled: false,
            },
          ],
        },
        textField: {
          fullWidth: true,
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
