import { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'danger' | 'warning'
  className?: string
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-primary',
    success: 'bg-green-100 text-success',
    danger: 'bg-red-100 text-danger',
    warning: 'bg-yellow-100 text-warning',
  }

  return (
    <span
      className={cn(
        'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
