import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useAuthStore } from '../lib/auth';
import { registerTokenGetter } from '../lib/api';

/** Syncs Clerk auth state into the zustand store and wires up the API token getter */
export function AuthSync() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (isSignedIn && user) {
      setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        role: (user.publicMetadata?.role as string) ?? 'RETAILER',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      });
      registerTokenGetter(() => getToken());
    } else {
      clearUser();
    }
  }, [isSignedIn, user, setUser, clearUser, getToken]);

  return null;
}
