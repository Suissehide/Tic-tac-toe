import { create } from 'zustand'
import type { ToastActionElement, ToastProps } from '../components/ui/toast.tsx'
import type React from 'react'
import type { ToastSeverity } from '../constants/ui.constant.ts'
import { devtools } from 'zustand/middleware'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  message?: React.ReactNode
  severity?: ToastSeverity
  action?: ToastActionElement
}

type ToastState = {
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, 'id'>) => string
  updateToast: (toast: Partial<ToasterToast> & { id: string }) => void
  dismissToast: (id?: string, removeDelay?: number) => void
  removeToast: (id?: string) => void
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      toasts: [],

      addToast: (toastData) => {
        const id = genId()

        const onOpenChange = (open: boolean) => {
          if (!open) {
            get().dismissToast(id)
          }
        }

        const newToast: ToasterToast = {
          ...toastData,
          id,
          open: true,
          duration: TOAST_REMOVE_DELAY,
          onOpenChange,
        }

        set((state) => ({
          toasts: [newToast, ...state.toasts].slice(0, TOAST_LIMIT),
        }))

        return id
      },

      updateToast: (updatedToast) => {
        set((state) => ({
          toasts: state.toasts.map((t) =>
            t.id === updatedToast.id ? { ...t, ...updatedToast } : t,
          ),
        }))
      },

      dismissToast: (id, removeDelay = TOAST_REMOVE_DELAY) => {
        const ids = id ? [id] : get().toasts.map((t) => t.id)

        for (const toastId of ids) {
          if (!toastTimeouts.has(toastId)) {
            const timeout = setTimeout(() => {
              toastTimeouts.delete(toastId)
              get().removeToast(toastId)
            }, removeDelay)
            toastTimeouts.set(toastId, timeout)
          }
        }

        set((state) => ({
          toasts: state.toasts.map((t) =>
            ids.includes(t.id) ? { ...t, open: false } : t,
          ),
        }))
      },

      removeToast: (id) => {
        if (id && toastTimeouts.has(id)) {
          clearTimeout(toastTimeouts.get(id))
          toastTimeouts.delete(id)
        }

        set((state) => ({
          toasts: id ? state.toasts.filter((t) => t.id !== id) : [],
        }))
      },
    }),
    {
      name: 'toast-store',
    },
  ),
)
