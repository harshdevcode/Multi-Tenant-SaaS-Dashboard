import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from './store'
import { router } from './router'
import { queryClient } from '@/lib/queryClient'
import { rehydrateFromToken } from '@/features/auth/authSlice'

function AppBootstrap() {
  useEffect(() => {
    // On mount, check if a token exists in sessionStorage and rehydrate auth state.
    // This makes page refreshes seamless — user doesn't have to re-login.
    store.dispatch(rehydrateFromToken())
  }, [])

  return <RouterProvider router={router} />
}

export function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  )
}
