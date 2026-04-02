import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MailCheck, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

/** Email verification handler — validates the token and shows result */
export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    api.post('/v1/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Verifying Email</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please wait while we confirm your email address...</p>
            <Loader2 size={24} className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Email Verified!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your email has been confirmed. You can now log in to your account.</p>
            <Link to="/auth/login" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Continue to Login <ArrowRight size={14} />
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Verification Failed</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This link may be expired or invalid. Please request a new verification email.</p>
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              Go to Login <ArrowRight size={14} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
