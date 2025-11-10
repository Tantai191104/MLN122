import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set authentication data
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      // Logout
      logout: () => {
        // Xóa localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        
        // Reset state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Initialize auth from localStorage
      initAuth: () => {
        const token = localStorage.getItem('access_token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            set({
              user,
              token,
              isAuthenticated: true,
            })
          } catch (error) {
            console.error('Failed to parse user data:', error)
            // Clear invalid data
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
          }
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
