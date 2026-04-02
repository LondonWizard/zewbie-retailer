import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { registerTokenGetter } from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  onboardingComplete: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/** Provides auth state from Clerk (or dev fallback) to the component tree */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!CLERK_KEY) {
    if (import.meta.env.PROD) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
            <p className="text-gray-600 mt-2">Authentication is not configured. Contact administrator.</p>
          </div>
        </div>
      );
    }
    return <DevAuthProvider>{children}</DevAuthProvider>;
  }
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}

function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut, getToken } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    registerTokenGetter(() => getToken());
    return () => registerTokenGetter(null);
  }, [getToken]);

  const role = (user?.publicMetadata?.role as string) ?? '';

  useEffect(() => {
    if (isLoaded && isSignedIn && user && role !== 'RETAILER') {
      clerk.signOut().then(() => {
        window.location.href = '/auth/login?error=unauthorized';
      });
    }
  }, [isLoaded, isSignedIn, user, role, clerk]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user
        ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? '',
            role,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            imageUrl: user.imageUrl ?? '',
            onboardingComplete: (user.publicMetadata?.onboardingComplete as boolean) ?? false,
          }
        : null,
      isLoaded,
      isSignedIn: !!isSignedIn && role === 'RETAILER',
      signOut: () => signOut(),
      getToken: () => getToken(),
    }),
    [user, isLoaded, isSignedIn, signOut, getToken, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function DevAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerTokenGetter(() => Promise.resolve('dev-token'));
    return () => registerTokenGetter(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: {
        id: 'dev-user',
        email: 'dev@zewbie.local',
        role: 'RETAILER',
        firstName: 'Dev',
        lastName: 'Retailer',
        imageUrl: '',
        onboardingComplete: true,
      },
      isLoaded: true,
      isSignedIn: true,
      signOut: async () => {
        window.location.href = '/auth/login';
      },
      getToken: async () => 'dev-token',
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
