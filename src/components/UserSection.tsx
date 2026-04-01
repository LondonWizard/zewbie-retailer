import { UserButton } from '@clerk/clerk-react';
import { useAuthContext } from '../providers/AuthProvider';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/** User avatar + name for sidebar footers; renders Clerk UserButton when configured */
export default function UserSection() {
  const { user, signOut } = useAuthContext();

  if (CLERK_KEY) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <UserButton afterSignOutUrl="/auth/login" />
        <span className="text-sm text-gray-700 truncate">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
        {user?.firstName?.[0] ?? 'D'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>
      <button
        onClick={signOut}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        Sign out
      </button>
    </div>
  );
}
