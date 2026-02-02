/**
 * Premium Toast Component
 * Enhanced with Framer-like animations via GSAP and premium styling
 */

import { useEffect, useRef, useCallback } from 'react'
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoWarning,
  IoClose
} from 'react-icons/io5'
import { cn } from '../utils/cn'
import gsap from 'gsap'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: IoCheckmarkCircle,
  error: IoCloseCircle,
  info: IoInformationCircle,
  warning: IoWarning,
}

const styles = {
  success: 'bg-white dark:bg-gray-900 border-success-200 dark:border-success-800 text-success-700 dark:text-success-300',
  error: 'bg-white dark:bg-gray-900 border-error-200 dark:border-error-800 text-error-700 dark:text-error-300',
  info: 'bg-white dark:bg-gray-900 border-info-200 dark:border-info-800 text-info-700 dark:text-info-300',
  warning: 'bg-white dark:bg-gray-900 border-warning-200 dark:border-warning-800 text-warning-700 dark:text-warning-300',
}

const iconColors = {
  success: 'text-success-500',
  error: 'text-error-500',
  info: 'text-info-500',
  warning: 'text-warning-500',
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  const handleClose = useCallback(() => {
    const element = ref.current
    // Kill any existing animations
    if (animationRef.current) {
      animationRef.current.kill()
    }
    
    if (element) {
      gsap.to(element, {
        opacity: 0,
        x: 100,
        scale: 0.9,
        duration: 0.3,
        ease: 'power4.in',
        onComplete: () => onClose(toast.id),
      })
    } else {
      onClose(toast.id)
    }
  }, [onClose, toast.id])

  useEffect(() => {
    const element = ref.current
    const progress = progressRef.current
    const duration = (toast.duration || 5000) / 1000

    if (element) {
      gsap.fromTo(
        element,
        { opacity: 0, x: 100, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power4.out'
        }
      )
    }

    if (progress) {
      animationRef.current = gsap.fromTo(
        progress,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: duration,
          ease: 'none',
          transformOrigin: 'left',
          onComplete: handleClose
        }
      )
    }

    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [toast.duration, handleClose])

  const Icon = icons[toast.type]

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={cn(
        'relative flex items-center gap-4 p-4 rounded-xl border-2 shadow-2xl overflow-hidden',
        'glass-strong min-w-[320px] max-w-md',
        styles[toast.type]
      )}
    >
      <div className={cn('flex-shrink-0', iconColors[toast.type])} aria-hidden="true">
        <Icon className="w-6 h-6" />
      </div>

      <p className="flex-1 text-sm font-semibold leading-snug">
        {toast.message}
      </p>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        aria-label="Close notification"
      >
        <IoClose className="w-5 h-5 text-gray-400" />
      </button>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className={cn(
          'absolute bottom-0 left-0 h-1 w-full',
          toast.type === 'success' ? 'bg-success-500' :
            toast.type === 'error' ? 'bg-error-500' :
              toast.type === 'warning' ? 'bg-warning-500' : 'bg-info-500'
        )}
      />
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[2000] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
