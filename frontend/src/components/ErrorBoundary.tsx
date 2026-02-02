/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './Button'
import { Card, CardBody } from './Card'
import { IoWarning, IoRefresh } from 'react-icons/io5'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Log error to your preferred error tracking service
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-lg w-full text-center">
            <CardBody className="py-12 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-error-100 dark:bg-error-950 text-error-500 flex items-center justify-center mx-auto">
                <IoWarning className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                  Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={this.handleReset}
                >
                  Try Again
                </Button>
                <Button
                  variant="primary"
                  icon={<IoRefresh />}
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Functional wrapper for async error boundaries (for use with Suspense)
 */
interface AsyncBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
}

export function AsyncBoundary({ children, fallback, loadingFallback }: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
