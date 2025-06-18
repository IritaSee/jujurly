import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  createdAt?: string
}

export interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (userData: { username: string; email: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(persist(
  (set, get) => ({
    // Initial state
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (credentials) => {
      try {
        set({ isLoading: true, error: null })
        
        const apiUrl = import.meta.env.VITE_API_URL || 'https://gzzdrs2tjx.ap-southeast-1.awsapprunner.com'
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()
        
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Login failed',
          isLoading: false,
          isAuthenticated: false,
        })
        throw error
      }
    },

    register: async (userData) => {
      try {
        set({ isLoading: true, error: null })
        
        const apiUrl = import.meta.env.VITE_API_URL || 'https://gzzdrs2tjx.ap-southeast-1.awsapprunner.com'
        const response = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Registration failed')
        }

        const data = await response.json()
        
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Registration failed',
          isLoading: false,
          isAuthenticated: false,
        })
        throw error
      }
    },

    logout: () => {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      })
      // Clear localStorage as well for backward compatibility
      localStorage.removeItem('username')
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
    },

    clearError: () => set({ error: null }),
    
    setLoading: (loading) => set({ isLoading: loading }),
    
    updateUser: (userData) => {
      const currentUser = get().user
      if (currentUser) {
        set({ user: { ...currentUser, ...userData } })
      }
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }),
  }
))