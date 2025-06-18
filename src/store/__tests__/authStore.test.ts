import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../authStore'
import { mockFetchSuccess, mockFetchError, waitForAsync } from '@/test/utils'

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      }
      const mockResponse = {
        user: mockUser,
        token: 'mock-token',
      }

      mockFetchSuccess(mockResponse)

      const { login } = useAuthStore.getState()
      await login({ username: 'testuser', password: 'password' })

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('mock-token')
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle login failure', async () => {
      mockFetchError('Invalid credentials', 401)

      const { login } = useAuthStore.getState()
      
      await expect(login({ username: 'testuser', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials')

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })

      global.fetch = vi.fn().mockReturnValue(promise)

      const { login } = useAuthStore.getState()
      const loginPromise = login({ username: 'testuser', password: 'password' })

      // Check loading state
      expect(useAuthStore.getState().isLoading).toBe(true)

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ user: { id: '1' }, token: 'token' }),
      })

      await loginPromise
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
      }
      const mockResponse = {
        user: mockUser,
        token: 'mock-token',
      }

      mockFetchSuccess(mockResponse)

      const { register } = useAuthStore.getState()
      await register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
      })

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('mock-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle registration failure', async () => {
      mockFetchError('Username already exists', 409)

      const { register } = useAuthStore.getState()
      
      await expect(register({
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('Username already exists')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('Username already exists')
    })
  })

  describe('logout', () => {
    it('should logout and clear state', () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { id: '1', username: 'test', email: 'test@example.com' },
        token: 'token',
        isAuthenticated: true,
      })

      const { logout } = useAuthStore.getState()
      logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('utility actions', () => {
    it('should clear error', () => {
      useAuthStore.setState({ error: 'Some error' })
      
      const { clearError } = useAuthStore.getState()
      clearError()
      
      expect(useAuthStore.getState().error).toBeNull()
    })

    it('should set loading state', () => {
      const { setLoading } = useAuthStore.getState()
      
      setLoading(true)
      expect(useAuthStore.getState().isLoading).toBe(true)
      
      setLoading(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should update user data', () => {
      const initialUser = { id: '1', username: 'test', email: 'test@example.com' }
      useAuthStore.setState({ user: initialUser })
      
      const { updateUser } = useAuthStore.getState()
      updateUser({ email: 'newemail@example.com' })
      
      const state = useAuthStore.getState()
      expect(state.user).toEqual({
        ...initialUser,
        email: 'newemail@example.com',
      })
    })
  })
})