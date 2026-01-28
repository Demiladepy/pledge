/**
 * Premium Skeleton Component
 * High-performance, brand-aligned loading states
 */

import { cn } from '../utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={cn(
        'animate-shimmer overflow-hidden relative',
        'bg-gray-200 dark:bg-gray-800',
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
    </div>
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

/**
 * Goal Card Skeleton
 */
export function GoalCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex justify-between mb-4">
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={100} height={24} />
      </div>
      <Skeleton variant="text" height={32} className="mb-4" />
      <SkeletonText lines={2} className="mb-6" />
      <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-4">
        <div>
          <Skeleton variant="text" width={40} height={12} className="mb-2" />
          <Skeleton variant="text" width={80} height={24} />
        </div>
        <Skeleton variant="rounded" width={120} height={40} />
      </div>
    </div>
  )
}
