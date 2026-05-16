import { QueryClient } from '@tanstack/react-query'
import { store } from '@/app/store'
import { logout } from '@/features/auth/authSlice'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30s — won't refetch on re-mount within that window
      staleTime: 30_000,
      // Keep cache for 5 minutes after component unmounts
      gcTime: 5 * 60_000,
      // Retry once on failure (not 3x — avoids hammering a down API)
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      onError: (error) => {
        // Global mutation error handler
        // 401 is already handled by the axios interceptor
        console.error('Mutation error:', error)
      },
    },
  },
})

// Handle query errors globally — 401 triggers logout
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
    throwOnError: false,
    // If a query returns 401, the axios interceptor already dispatched logout.
    // This is a safety net for non-axios fetches.
    retry: (failureCount, error) => {
      if ((error as { status?: number })?.status === 401) {
        store.dispatch(logout())
        return false
      }
      return failureCount < 1
    },
  },
})
