import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type FormFieldProps = {
  children: ReactNode
  className?: string
}

const FormField = ({ children, className }: FormFieldProps) => {
  return <div className={clsx('', className)}>{children}</div>
}

export { FormField }
