import React, { useState, useCallback } from 'react'
import Toast, { ToastType } from './Toast'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContainerProps {}

export default function ToastContainer({}: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration?: number) => {
      const id = Math.random().toString(36).substr(2, 9)
      const toast: ToastMessage = { id, message, type, duration }
      setToasts((prev) => [...prev, toast])
      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Expose methods globally
  React.useEffect(() => {
    ;(window as any).showToast = addToast
  }, [addToast])

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
