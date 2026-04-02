import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { ClerkProviderWithRouting } from './providers/ClerkProvider'
import { AuthProvider } from './providers/AuthProvider'
import App from './App'
import './i18n'
import './lib/theme'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="flex items-center justify-center h-screen text-red-600">Something went wrong. Please refresh the page.</div>}>
      <BrowserRouter>
        <ClerkProviderWithRouting>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ClerkProviderWithRouting>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
