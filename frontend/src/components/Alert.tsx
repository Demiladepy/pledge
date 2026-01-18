import { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { IoCheckmarkCircle, IoCloseCircle, IoWarning, IoInformation } from 'react-icons/io5'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  children: ReactNode
  className?: string
  onClose?: () => void
}

export function Alert({
  type = 'info',
  title,
  children,
  className,
  onClose,
}: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-success text-green-800',
    error: 'bg-red-50 border-danger text-red-800',
    warning: 'bg-yellow-50 border-warning text-yellow-800',
    info: 'bg-blue-50 border-primary text-blue-800',
  }

  const iconClasses = {
    success: <IoCheckmarkCircle className="w-5 h-5 text-success flex-shrink-0" />,
    error: <IoCloseCircle className="w-5 h-5 text-danger flex-shrink-0" />,
    warning: <IoWarning className="w-5 h-5 text-warning flex-shrink-0" />,
    info: <IoInformation className="w-5 h-5 text-primary flex-shrink-0" />,
  }

  return (
    <div
      className={cn(
        'border rounded-lg p-4 flex gap-3',
        typeClasses[type],
        className,
      )}
    >
      {iconClasses[type]}
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  )
}
