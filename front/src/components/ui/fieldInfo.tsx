import type { AnyFieldApi } from '@tanstack/react-form'
import { clsx } from 'clsx'

type FieldInfoProps = {
  field: AnyFieldApi
  className?: string
}

const FieldInfo = ({ field, className }: FieldInfoProps) => {
  const showError = field.state.meta.isTouched && !field.state.meta.isValid
  const isValidating = field.state.meta.isValidating

  return (
    <div className={clsx(`text-xs ${showError ? 'font-medium': ''}`, className)}>
      {showError && (
        <em className="text-destructive">
          {field.state.meta.errors.join(', ')}
        </em>
      )}
      {isValidating && <span className="text-gray-500">Validating...</span>}
    </div>
  )
}

FieldInfo.displayName = 'FieldInfo'

export { FieldInfo }
