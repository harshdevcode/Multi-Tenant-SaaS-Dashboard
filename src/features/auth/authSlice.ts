import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from '@/types'
import { authApi } from '@/lib/api'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      // Persist token so the session survives a page refresh
      sessionStorage.setItem('token', response.token)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return rejectWithValue(message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  sessionStorage.removeItem('token')
})

export const rehydrateFromToken = createAsyncThunk(
  'auth/rehydrate',
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem('token')
    if (!token) return rejectWithValue('No token')
    try {
      const user = await authApi.me(token)
      return { user, token }
    } catch {
      sessionStorage.removeItem('token')
      return rejectWithValue('Token invalid')
    }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Allow switching tenant context (admin feature)
    switchTenant(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.tenantId = action.payload
      }
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // logout
    builder.addCase(logout.fulfilled, () => initialState)

    // rehydrate
    builder
      .addCase(rehydrateFromToken.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = (action.payload as { user: AuthUser; token: string }).user
        state.token = (action.payload as { user: AuthUser; token: string }).token
      })
      .addCase(rehydrateFromToken.rejected, () => initialState)
  },
})

export const { switchTenant, clearError } = authSlice.actions
export default authSlice.reducer
