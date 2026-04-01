import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/** Login page for existing retailers */
export default function Login() {
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
    <div className="flex justify-center">
      <SignIn
        path="/auth/login"
        signUpUrl="/auth/register"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
