import { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'border-gray-300 dark:border-gray-600',
          'focus:outline-none focus:border-blue-500 dark:focus:border-blue-400',
          'focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
          'hover:border-gray-400 dark:hover:border-gray-500',
          error && 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400 animate-slide-up">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}
