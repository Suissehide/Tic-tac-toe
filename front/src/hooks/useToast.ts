import { useCallback } from 'react'

import { type ToasterToast, useToastStore } from '../store/useToastStore'

type Toast = Omit<ToasterToast, 'id'>

export function useToast() {
  const toasts = useToastStore((state) => state.toasts)
  const addToast = useToastStore((state) => state.addToast)
  const dismissToast = useToastStore((state) => state.dismissToast)
  const updateToast = useToastStore((state) => state.updateToast)

  const toast = useCallback(
    (props: Toast) => {
      const id = addToast(props)
      return {
        id,
        dismiss: () => dismissToast(id),
        update: (updated: Partial<ToasterToast>) =>
          updateToast({ ...updated, id }),
      }
    },
    [addToast, dismissToast, updateToast],
  )

  return { toasts, toast }
}
