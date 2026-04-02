import { ClerkProvider } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

export function ClerkProviderWithRouting({ children }: { children: React.ReactNode }) {
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>
  }
  return <ClerkWithNav>{children}</ClerkWithNav>
}

function ClerkWithNav({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY!}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
      signInUrl="/auth/login"
      signUpUrl="/auth/register"
    >
      {children}
    </ClerkProvider>
  )
}
