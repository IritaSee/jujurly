import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Basic loading spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      data-testid="loading-spinner"
      className={cn('animate-spin', sizeClasses[size], className)} 
    />
  )
}

// Full page loading
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
)

// Skeleton components
export const Skeleton: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Feedback card skeleton
export const FeedbackCardSkeleton: React.FC = () => (
  <div className="p-6 border rounded-lg space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
)

// Dashboard skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="container mx-auto p-6 space-y-6">
    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
    
    {/* Feedback list skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      {Array.from({ length: 5 }).map((_, i) => (
        <FeedbackCardSkeleton key={i} />
      ))}
    </div>
  </div>
)

// Form skeleton
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-24 w-full" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
)

// Button loading state
export const ButtonLoading: React.FC<{
  children: React.ReactNode
  isLoading?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  loadingText?: string
}> = ({ 
  children, 
  isLoading = false, 
  className, 
  disabled,
  loadingText,
  ...props 
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'bg-primary text-primary-foreground hover:bg-primary/90',
      'h-10 px-4 py-2',
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
    {isLoading && loadingText ? loadingText : children}
  </button>
)

// Inline loading for content areas
export const InlineLoading: React.FC<{
  message?: string
  className?: string
}> = ({ message = 'Loading...', className }) => (
  <div className={cn('flex items-center justify-center py-8', className)}>
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  </div>
)

// Loading overlay
export const LoadingOverlay: React.FC<{
  isVisible: boolean
  message?: string
}> = ({ isVisible, message = 'Loading...' }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}