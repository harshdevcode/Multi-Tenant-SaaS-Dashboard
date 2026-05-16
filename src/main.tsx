import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './index.css'

async function enableMocking() {
  // Enable MSW in both DEV and PROD so mock APIs work everywhere
  try {
    const { worker } = await import('./lib/msw/browser')
    return worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL || '/'}mockServiceWorker.js`,
      },
      onUnhandledRequest: 'bypass',
    })
  } catch (error) {
    console.warn('[MSW] Failed to start:', error)
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})