import { SignIn } from '@clerk/clerk-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const FEATURES = [
  { icon: ShieldCheck, text: 'Secure, encrypted authentication' },
  { icon: Zap, text: 'Instant access to your dashboard' },
  { icon: BarChart3, text: 'Real-time order and revenue tracking' },
];

/** Retailer login page — shows Clerk SignIn with branding and dark mode */
export default function Login() {
  const [searchParams] = useSearchParams();
  const isUnauthorized = searchParams.get('error') === 'unauthorized';

  if (!CLERK_KEY) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center max-w-md">
          <Sparkles size={32} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Development Mode</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Clerk is not configured — auth is bypassed.</p>
          <Link to="/dashboard" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 p-12 flex-col justify-center">
        <Sparkles size={28} className="text-white mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
        <p className="text-indigo-100 mb-8">Access your retailer portal to manage products, orders, and payments.</p>
        <div className="space-y-4">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg"><f.icon size={16} className="text-white" /></div>
              <span className="text-sm text-indigo-100">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          {isUnauthorized && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              Access denied. This portal is restricted to approved retailers only.
            </div>
          )}
          <SignIn
            routing="path" path="/auth/login"
            signUpUrl="/auth/register"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
