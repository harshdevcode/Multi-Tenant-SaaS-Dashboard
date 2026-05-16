import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // RTK Query middleware would go here if used
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        ignoredActions: [],
      },
    }),
})

// Infer types from store itself — no need to maintain them manually
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
