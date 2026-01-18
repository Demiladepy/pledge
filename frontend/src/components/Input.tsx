import { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2.5 border rounded-lg transition-colors',
          'bg-white text-gray-900 placeholder-gray-400',
          'border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
