import React, { useEffect, useRef, type JSX } from 'react'
import { cn } from '@/lib/utils'

// Skip to main content link for keyboard navigation
export const SkipToMain: React.FC = () => (
  <a
    href="#main-content"
    className={cn(
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
      'bg-primary text-primary-foreground px-4 py-2 rounded-md',
      'z-50 transition-all duration-200'
    )}
  >
    Skip to main content
  </a>
)

// Screen reader only text
export const ScreenReaderOnly: React.FC<{
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}> = ({ children, as: Component = 'span' }) => (
  <Component className="sr-only">
    {children}
  </Component>
)

// Focus trap for modals and dialogs
export const FocusTrap: React.FC<{
  children: React.ReactNode
  isActive?: boolean
}> = ({ children, isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    firstFocusableRef.current = focusableElements[0] as HTMLElement
    lastFocusableRef.current = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          lastFocusableRef.current?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          firstFocusableRef.current?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstFocusableRef.current?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  )
}

// Announcement for screen readers
export const LiveRegion: React.FC<{
  message: string
  politeness?: 'polite' | 'assertive'
  atomic?: boolean
}> = ({ message, politeness = 'polite', atomic = true }) => (
  <div
    aria-live={politeness}
    aria-atomic={atomic}
    className="sr-only"
  >
    {message}
  </div>
)

// Custom hook for managing focus
export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }

  const focusElement = (element: HTMLElement | null) => {
    if (element) {
      element.focus()
    }
  }

  return { saveFocus, restoreFocus, focusElement }
}

// Custom hook for keyboard navigation
export const useKeyboardNavigation = ({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
}: {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
} = {}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          onEnter?.()
          break
        case 'ArrowUp':
          event.preventDefault()
          onArrowUp?.()
          break
        case 'ArrowDown':
          event.preventDefault()
          onArrowDown?.()
          break
        case 'ArrowLeft':
          onArrowLeft?.()
          break
        case 'ArrowRight':
          onArrowRight?.()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight])
}

// Accessible button component
export const AccessibleButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
  type?: 'button' | 'submit' | 'reset'
}> = ({ 
  children, 
  onClick, 
  disabled, 
  ariaLabel, 
  ariaDescribedBy,
  className,
  type = 'button',
  ...props 
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    className={cn(
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-all duration-200',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

// Accessible form field wrapper
export const FormField: React.FC<{
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
  description?: string
  className?: string
}> = ({ label, children, error, required, description, className }) => {
  const fieldId = React.useId()
  const errorId = `${fieldId}-error`
  const descriptionId = `${fieldId}-description`

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={fieldId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement<any>, {
          id: fieldId,
          'aria-describedby': [
            description ? descriptionId : '',
            error ? errorId : ''
          ].filter(Boolean).join(' ') || undefined,
          'aria-invalid': error ? 'true' : undefined,
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Custom hook for announcements
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState('')
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>('polite')

  const announce = (message: string, level: 'polite' | 'assertive' = 'polite') => {
    setPoliteness(level)
    setAnnouncement('')
    // Small delay to ensure screen readers pick up the change
    setTimeout(() => setAnnouncement(message), 100)
  }

  const AnnouncementRegion = () => (
    <LiveRegion message={announcement} politeness={politeness} />
  )

  return { announce, AnnouncementRegion }
}