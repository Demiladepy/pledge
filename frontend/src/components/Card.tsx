/**
 * Premium Card Component
 * Enhanced with 5 variants, shine effects, and premium animations
 */

import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'elevated' | 'interactive' | 'gradient'
  hover?: boolean
  shine?: boolean
  noise?: boolean
  className?: string
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  shine = false,
  noise = false,
  className,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
    glass: 'glass shadow-xl',
    elevated: 'bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700',
    interactive: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400',
    gradient: 'bg-gradient-to-br from-white via-indigo-50/30 to-cyan-50/30 dark:from-gray-800 dark:via-indigo-950/30 dark:to-cyan-950/30 shadow-xl border border-indigo-100 dark:border-indigo-900/50',
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300',
        variantClasses[variant],
        hover && 'hover:shadow-xl hover:-translate-y-1',
        shine && 'card-shine',
        noise && 'noise-texture',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 pb-4 border-b border-gray-200 dark:border-gray-700',
        'flex items-center justify-between',
        className,
      )}
    >
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-xl font-heading font-bold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)}>
      {children}
    </p>
  )
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-6 pt-4 border-t border-gray-200 dark:border-gray-700',
        'flex items-center justify-between gap-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Goal Card - Specialized card for displaying goals
 */
interface GoalCardProps {
  title: string
  description?: string
  progress: number
  total: number
  stake: string
  deadline: string
  status: 'active' | 'completed' | 'failed' | 'pending'
  onSubmitProof?: () => void
  className?: string
}

export function GoalCard({
  title,
  description,
  progress,
  total,
  stake,
  deadline,
  status,
  onSubmitProof,
  className,
}: GoalCardProps) {
  const statusColors = {
    active: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  }

  const progressPercentage = (progress / total) * 100

  return (
    <Card variant="elevated" hover shine className={cn('group', className)}>
      <div className="flex items-center justify-between mb-4">
        <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', statusColors[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{deadline}</span>
      </div>

      <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {progress}/{total}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 block">Stake</span>
          <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">{stake}</p>
        </div>
        {onSubmitProof && status === 'active' && (
          <button
            onClick={onSubmitProof}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Submit Proof
          </button>
        )}
      </div>
    </Card>
  )
}
