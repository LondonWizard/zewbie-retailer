import { useEffect } from 'react'

/** Redirects to Clerk's password reset flow */
export default function ForgotPassword() {
  useEffect(() => {
    window.location.href = 'https://accounts.clerk.dev/sign-in#/forgot-password';
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Redirecting to password reset...</p>
    </div>
  );
}
