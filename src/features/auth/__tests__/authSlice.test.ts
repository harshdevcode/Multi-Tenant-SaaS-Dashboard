import authReducer, { switchTenant, clearError } from '@/features/auth/authSlice'
import type { AuthState } from '@/types'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  name: 'Test Admin',
  role: 'admin' as const,
  tenantId: 'tenant-1',
  avatarInitials: 'TA',
}

const authenticatedState: AuthState = {
  user: mockUser,
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
}

describe('authSlice reducer', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  describe('switchTenant action', () => {
    it('updates tenantId on the user when authenticated', () => {
      const newState = authReducer(authenticatedState, switchTenant('tenant-2'))
      expect(newState.user?.tenantId).toBe('tenant-2')
    })

    it('does nothing when user is null', () => {
      const newState = authReducer(initialState, switchTenant('tenant-2'))
      expect(newState.user).toBeNull()
    })

    it('does not mutate other user fields', () => {
      const newState = authReducer(authenticatedState, switchTenant('tenant-2'))
      expect(newState.user?.email).toBe(mockUser.email)
      expect(newState.user?.role).toBe(mockUser.role)
    })
  })

  describe('clearError action', () => {
    it('clears the error field', () => {
      const stateWithError: AuthState = { ...initialState, error: 'Login failed' }
      const newState = authReducer(stateWithError, clearError())
      expect(newState.error).toBeNull()
    })

    it('does not affect other fields', () => {
      const stateWithError: AuthState = { ...authenticatedState, error: 'Some error' }
      const newState = authReducer(stateWithError, clearError())
      expect(newState.isAuthenticated).toBe(true)
      expect(newState.user).toEqual(mockUser)
    })
  })

  describe('login async thunk', () => {
    it('sets isLoading true on pending', () => {
      const action = { type: 'auth/login/pending' }
      const newState = authReducer(initialState, action)
      expect(newState.isLoading).toBe(true)
      expect(newState.error).toBeNull()
    })

    it('sets user and token on fulfilled', () => {
      const action = {
        type: 'auth/login/fulfilled',
        payload: { user: mockUser, token: 'jwt-token' },
      }
      const newState = authReducer(initialState, action)
      expect(newState.isAuthenticated).toBe(true)
      expect(newState.user).toEqual(mockUser)
      expect(newState.token).toBe('jwt-token')
      expect(newState.isLoading).toBe(false)
    })

    it('sets error on rejected', () => {
      const action = {
        type: 'auth/login/rejected',
        payload: 'Invalid credentials',
      }
      const newState = authReducer(initialState, action)
      expect(newState.isLoading).toBe(false)
      expect(newState.error).toBe('Invalid credentials')
      expect(newState.isAuthenticated).toBe(false)
    })
  })

  describe('logout async thunk', () => {
    it('resets to initial state on fulfilled', () => {
      const action = { type: 'auth/logout/fulfilled' }
      const newState = authReducer(authenticatedState, action)
      expect(newState).toEqual(initialState)
    })
  })
})
