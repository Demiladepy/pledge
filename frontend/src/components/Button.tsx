/**
 * Premium Button Component
 * Enhanced with 8+ variants, ripple effects, and premium animations
 */

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?:
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'gradient'
  | 'glass'
  | 'white'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  withRipple?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  withRipple = true,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Variant styles using design system colors
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 dark:from-indigo-500 dark:to-indigo-600',
    secondary:
      'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/50',
    outline:
      'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/30',
    ghost:
      'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/50',
    success:
      'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/50',
    gradient:
      'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl animate-gradientShift',
    glass:
      'glass text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-gray-800/80 shadow-lg',
    white: 'bg-white text-indigo-600 hover:bg-gray-50 shadow-lg',
  }

  // Size styles
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }

  // Icon size based on button size
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }

  return (
    <button
      className={cn(
        // Base styles
        'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2',
        'relative overflow-hidden',

        // Hover & Active states
        'hover:scale-105 active:scale-95 transform',

        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400',

        // Disabled styles
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',

        // Ripple effect
        withRipple && 'button-ripple',

        // Variant & Size
        variantClasses[variant],
        sizeClasses[size],

        // Full width
        fullWidth && 'w-full',

        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className={cn('animate-spin', iconSizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon */}
      {icon && !isLoading && iconPosition === 'left' && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}

      {/* Button Text */}
      <span>{children}</span>

      {/* Right Icon */}
      {icon && !isLoading && iconPosition === 'right' && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
    </button>
  )
}

/**
 * Icon-only Button variant
 */
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: ReactNode
  'aria-label': string
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
  }

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('!p-0 aspect-square', sizeClasses[size], className)}
      {...props}
    >
      <span className={iconSizeClasses[size]}>{icon}</span>
    </Button>
  )
}
