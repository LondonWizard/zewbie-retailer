import { SignIn } from '@clerk/clerk-react';
import { Link, useSearchParams } from 'react-router-dom';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/** Retailer login page — shows Clerk SignIn with unauthorized error handling */
export default function Login() {
  const [searchParams] = useSearchParams();
  const isUnauthorized = searchParams.get('error') === 'unauthorized';

  if (!CLERK_KEY) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Development Mode</h1>
        <p className="text-gray-500 mb-6">Clerk is not configured — auth is bypassed.</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isUnauthorized && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm max-w-md">
          Access denied. This portal is restricted to approved retailers only.
        </div>
      )}
      <SignIn
        path="/auth/login"
        signUpUrl="/auth/register"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
