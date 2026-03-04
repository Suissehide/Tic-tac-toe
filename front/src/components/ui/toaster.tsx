import { Check, Shrimp, X } from 'lucide-react'

import { TOAST_SEVERITY } from '../../constants/ui.constant.ts'
import { useToast } from '../../hooks/useToast.ts'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast.tsx'

export function Toaster() {
  const { toasts } = useToast()

  function getVariantFromSeverity(severity?: string) {
    switch (severity) {
      case TOAST_SEVERITY.SUCCESS:
        return 'success'
      case TOAST_SEVERITY.ERROR:
        return 'destructive'
      case TOAST_SEVERITY.WARNING:
        return 'warning'
      case TOAST_SEVERITY.INFO:
        return 'info'
      default:
        return 'default'
    }
  }

  function getIconFromSeverity(severity?: string) {
    switch (severity) {
      case TOAST_SEVERITY.SUCCESS:
        return <Check strokeWidth={2.5} className="w-3 h-3" />
      case TOAST_SEVERITY.ERROR:
        return <X strokeWidth={2.5} className="w-3 h-3" />
      case TOAST_SEVERITY.WARNING:
        return (
          <span className="font-bold text-sm flex justify-center items-center w-3 h-3">
            !
          </span>
        )
      case TOAST_SEVERITY.INFO:
        return (
          <span className="font-bold text-sm flex justify-center items-center w-3 h-3">
            i
          </span>
        )
      default:
        return <Shrimp strokeWidth={2.5} className="w-3 h-3" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(({ id, title, message, severity, action, ...props }) => (
        <Toast key={id} {...props} variant={getVariantFromSeverity(severity)}>
          <ToastIcon variant={getVariantFromSeverity(severity)}>
            {getIconFromSeverity(severity)}
          </ToastIcon>
          <div className="flex-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {message && <ToastDescription>{message}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
