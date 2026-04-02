import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Users, Gem } from 'lucide-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Verified seller accounts with identity protection' },
  { icon: Users, text: 'Join 2,500+ successful jewelry retailers' },
  { icon: Gem, text: 'List unlimited products across all categories' },
];

/** Registration page for new retailer accounts with branding panel */
export default function Register() {
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 p-12 flex-col justify-center">
        <Sparkles size={28} className="text-white mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">Start Selling</h2>
        <p className="text-indigo-100 mb-8">Create your retailer account and begin listing products in minutes.</p>
        <div className="space-y-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.text} className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg"><h.icon size={16} className="text-white" /></div>
              <span className="text-sm text-indigo-100">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <SignUp path="/auth/register" signInUrl="/auth/login" fallbackRedirectUrl="/onboarding" />
      </div>
    </div>
  );
}
