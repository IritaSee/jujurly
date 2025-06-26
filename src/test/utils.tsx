import React, { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useFeedbackStore } from '@/store/feedbackStore'
import { expect, vi } from 'vitest'

// Mock data for testing
export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
}

export const mockFeedback = [
  {
    id: '1',
    message: 'Great work on the presentation!',
    sentiment: 'positive' as const,
    timestamp: '2024-01-01T10:00:00Z',
    isAnonymous: false,
    fromUser: 'colleague1',
    isRead: true,
  },
  {
    id: '2',
    message: 'Could improve communication',
    sentiment: 'negative' as const,
    timestamp: '2024-01-01T11:00:00Z',
    isAnonymous: true,
    isRead: false,
  },
]

// Custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Store utilities for testing
export const setupAuthStore = (initialState?: Partial<ReturnType<typeof useAuthStore.getState>>) => {
  const store = useAuthStore.getState()
  
  // Reset store to initial state
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    ...initialState,
  })
  
  return store
}

export const setupFeedbackStore = (initialState?: Partial<ReturnType<typeof useFeedbackStore.getState>>) => {
  const store = useFeedbackStore.getState()
  
  // Reset store to initial state
  useFeedbackStore.setState({
    feedbackItems: [],
    isLoading: false,
    error: null,
    lastFetched: null,
    hasMore: true,
    currentPage: 1,
    ...initialState,
  })
  
  return store
}

// Mock authenticated user
export const mockAuthenticatedUser = () => {
  setupAuthStore({
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true,
  })
}

// Mock feedback data
export const mockFeedbackData = () => {
  setupFeedbackStore({
    feedbackItems: mockFeedback,
    lastFetched: Date.now(),
  })
}

// Mock fetch responses
export const mockFetchSuccess = (data: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  })
}

export const mockFetchError = (error: string, status = 400) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: error,
    json: async () => ({ message: error }),
  })
}

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Custom matchers for better assertions
export const expectToBeLoading = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-busy', 'true')
}

export const expectToHaveError = (element: HTMLElement, errorMessage?: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('role', 'alert')
  if (errorMessage) {
    expect(element).toHaveTextContent(errorMessage)
  }
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'