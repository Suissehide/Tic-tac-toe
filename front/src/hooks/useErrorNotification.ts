import { useEffect, useRef } from 'react'

import { TOAST_SEVERITY } from '../constants/ui.constant.ts'
import { type ApiError, isApiError } from '../libs/httpErrorHandler.ts'
import { useToast } from './useToast.ts'

export const useErrorNotification = (
  isError: boolean,
  error: Error | ApiError | null,
  errorMessage?: string,
) => {
  const { toast } = useToast()
  const errorShownRef = useRef<string | null>(null)

  useEffect(() => {
    if (isError && error) {
      const errorId = `${error.message}-${Date.now()}`

      if (errorShownRef.current !== errorId) {
        errorShownRef.current = errorId

        const errorTitle = isApiError(error) ? error.title : 'Erreur inconnue'
        const title = errorMessage ?? errorTitle
        const message = error.message

        toast({
          title,
          message,
          severity: TOAST_SEVERITY.ERROR,
        })
      }
    }

    if (!isError) {
      errorShownRef.current = null
    }
  }, [isError, error, errorMessage, toast])
}
