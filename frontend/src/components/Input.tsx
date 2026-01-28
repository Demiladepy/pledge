/**
 * Premium Input Component
 * Enhanced with icons, validation states, character counter, and animations
 */

import { InputHTMLAttributes, ReactNode, useState } from 'react'
import { cn } from '../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  maxLength?: number
  showCharCount?: boolean
}

export function Input({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  maxLength,
  showCharCount = false,
  className,
  id,
  value,
  onChange,
  ...props
}: InputProps) {
  const inputId = id || props.name
  const [charCount, setCharCount] = useState(
    typeof value === 'string' ? value.length : 0
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharCount(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'border-gray-300 dark:border-gray-600',
            'focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400',
            'focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10',
            'hover:border-gray-400 dark:hover:border-gray-500',
            'input-glow',
            error && 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10 animate-shake',
            success && 'border-green-500 dark:border-green-500 focus:border-green-500 focus:ring-green-500/10',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className,
          )}
          {...props}
        />

        {rightIcon && !error && !success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-scaleIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex-1">
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-slideUp">
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400 animate-slideUp">
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
        </div>

        {showCharCount && maxLength && (
          <p className={cn(
            'text-xs font-mono',
            charCount > maxLength * 0.9 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Textarea Component
 */
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  maxLength?: number
  showCharCount?: boolean
  rows?: number
}

export function Textarea({
  label,
  error,
  success,
  helperText,
  maxLength,
  showCharCount = false,
  rows = 4,
  className,
  id,
  value,
  onChange,
  ...props
}: TextareaProps) {
  const inputId = id || props.name
  const [charCount, setCharCount] = useState(
    typeof value === 'string' ? value.length : 0
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    onChange?.(e as any)
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'border-gray-300 dark:border-gray-600',
          'focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400',
          'focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10',
          'hover:border-gray-400 dark:hover:border-gray-500',
          'resize-none',
          'input-glow',
          error && 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10 animate-shake',
          success && 'border-green-500 dark:border-green-500 focus:border-green-500 focus:ring-green-500/10',
          className,
        )}
        {...props}
      />

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex-1">
          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-slideUp">
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400 animate-slideUp">
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
        </div>

        {showCharCount && maxLength && (
          <p className={cn(
            'text-xs font-mono',
            charCount > maxLength * 0.9 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
