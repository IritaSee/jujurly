import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import {
  LoadingSpinner,
  PageLoading,
  Skeleton,
  FeedbackCardSkeleton,
  DashboardSkeleton,
  ButtonLoading,
  InlineLoading,
  LoadingOverlay,
} from '../LoadingStates'

describe('LoadingStates', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-6', 'h-6', 'animate-spin')
    })

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('applies custom className', () => {
      render(<LoadingSpinner className="text-blue-500" />)
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('text-blue-500')
    })
  })

  describe('PageLoading', () => {
    it('renders with default message', () => {
      render(<PageLoading />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<PageLoading message="Please wait..." />)
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
    })
  })

  describe('Skeleton', () => {
    it('renders skeleton element', () => {
      render(<Skeleton className="h-4 w-20" />)
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('h-4', 'w-20', 'bg-muted')
    })

    it('renders with children', () => {
      render(
        <Skeleton>
          <span>Content</span>
        </Skeleton>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('FeedbackCardSkeleton', () => {
    it('renders feedback card skeleton structure', () => {
      render(<FeedbackCardSkeleton />)
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('DashboardSkeleton', () => {
    it('renders dashboard skeleton structure', () => {
      render(<DashboardSkeleton />)
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(5) // Should have multiple skeleton elements
    })
  })

  describe('ButtonLoading', () => {
    it('renders button with children', () => {
      render(<ButtonLoading>Click me</ButtonLoading>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('shows loading state', () => {
      render(<ButtonLoading isLoading>Submit</ButtonLoading>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Submit')
    })

    it('handles disabled state', () => {
      render(<ButtonLoading disabled>Disabled</ButtonLoading>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('InlineLoading', () => {
    it('renders with default message', () => {
      render(<InlineLoading />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<InlineLoading message="Fetching data..." />)
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })
  })

  describe('LoadingOverlay', () => {
    it('does not render when not visible', () => {
      render(<LoadingOverlay isVisible={false} />)
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('renders when visible', () => {
      render(<LoadingOverlay isVisible={true} />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<LoadingOverlay isVisible={true} message="Processing..." />)
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })
})