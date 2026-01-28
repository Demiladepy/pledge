/**
 * Premium Badge Component
 * Enhanced with 6 variants, pulse animation, and icon support
 */

import { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  dot?: boolean
  icon?: ReactNode
  className?: string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  pulse = false,
  dot = false,
  icon,
  className
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    secondary: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    success: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const dotColors = {
    primary: 'bg-indigo-500',
    secondary: 'bg-cyan-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        'transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'animate-pulse',
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant], pulse && 'animate-pulse')} />
      )}
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </span>
  )
}

/**
 * Status Badge - Specialized badge for status indicators
 */
interface StatusBadgeProps {
  status: 'active' | 'completed' | 'failed' | 'pending' | 'cancelled'
  pulse?: boolean
  className?: string
}

export function StatusBadge({ status, pulse = false, className }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'primary' as const, label: 'Active', dot: true },
    completed: { variant: 'success' as const, label: 'Completed', dot: false },
    failed: { variant: 'danger' as const, label: 'Failed', dot: false },
    pending: { variant: 'warning' as const, label: 'Pending', dot: true },
    cancelled: { variant: 'info' as const, label: 'Cancelled', dot: false },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      pulse={pulse && config.dot}
      className={className}
    >
      {config.label}
    </Badge>
  )
}
