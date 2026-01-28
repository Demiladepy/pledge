/**
 * Premium Alert Component
 * Enhanced with icons, actions, and animations
 */

import { ReactNode } from 'react'
import { cn } from '../utils/cn'
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
  IoInformationCircle,
  IoClose
} from 'react-icons/io5'

interface AlertProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  icon?: ReactNode
  action?: ReactNode
  onClose?: () => void
  className?: string
}

export function Alert({
  children,
  variant = 'info',
  title,
  icon,
  action,
  onClose,
  className,
}: AlertProps) {
  const variantConfig = {
    info: {
      bg: 'bg-info-50 dark:bg-info-950/30',
      border: 'border-info-200 dark:border-info-800',
      text: 'text-info-700 dark:text-info-300',
      icon: <IoInformationCircle className="w-5 h-5" />,
    },
    success: {
      bg: 'bg-success-50 dark:bg-success-950/30',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-700 dark:text-success-300',
      icon: <IoCheckmarkCircle className="w-5 h-5" />,
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-950/30',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-700 dark:text-warning-300',
      icon: <IoWarning className="w-5 h-5" />,
    },
    error: {
      bg: 'bg-error-50 dark:bg-error-950/30',
      border: 'border-error-200 dark:border-error-800',
      text: 'text-error-700 dark:text-error-300',
      icon: <IoCloseCircle className="w-5 h-5" />,
    },
  }

  const config = variantConfig[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border-2',
        'animate-slideUp',
        config.bg,
        config.border,
        className,
      )}
      role="alert"
    >
      <div className={cn('mt-0.5', config.text)}>{icon || config.icon}</div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('font-heading font-bold mb-1', config.text)}>{title}</h4>
        )}
        <div className={cn('text-sm leading-relaxed', config.text)}>{children}</div>
        {action && <div className="mt-4">{action}</div>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'flex-shrink-0 p-1 rounded-lg transition-all',
            'hover:bg-black/5 dark:hover:bg-white/5',
            config.text,
          )}
          aria-label="Close alert"
        >
          <IoClose className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
