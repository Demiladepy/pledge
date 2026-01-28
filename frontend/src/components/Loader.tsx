/**
 * Premium Loader Component
 * Distinctive brand-aligned loading animations
 */

import { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white'
  className?: string
}

export function Loader({
  size = 'md',
  variant = 'primary',
  className
}: LoaderProps) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const variantClasses = {
    primary: 'text-indigo-600 dark:text-indigo-400',
    secondary: 'text-cyan-500 dark:text-cyan-400',
    white: 'text-white',
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        className={cn('animate-spin', variantClasses[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-10"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {/* Brand accent pulse */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-ping opacity-20',
        variant === 'primary' ? 'bg-indigo-500' :
          variant === 'secondary' ? 'bg-cyan-500' : 'bg-white'
      )} />
    </div>
  )
}

interface LoadingStateProps {
  isLoading: boolean
  children: ReactNode
  message?: string
  fallback?: ReactNode
}

export function LoadingState({
  isLoading,
  children,
  message = 'Processing verification...',
  fallback,
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
        {fallback || (
          <div className="flex flex-col items-center">
            <Loader size="lg" variant="primary" className="mb-6" />
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
              {message}
            </p>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Screen-level loader
 */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center p-8 glass rounded-2xl shadow-2xl">
        <Loader size="xl" variant="primary" className="mb-6" />
        <h2 className="font-heading font-bold text-2xl gradient-text">PledgeAgent</h2>
        <p className="text-gray-500 mt-2 font-medium">Securing your journey...</p>
      </div>
    </div>
  )
}
