import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';

/** Redirects to Clerk's password reset flow with branded loading state */
export default function ForgotPassword() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://accounts.clerk.dev/sign-in#/forgot-password';
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound size={28} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Redirecting you to the secure password reset page...</p>
        <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-6" />
        <Link to="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
