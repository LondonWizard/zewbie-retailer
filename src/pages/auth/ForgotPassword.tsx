/** Forgot password form — sends a reset link to the retailer's email */
export default function ForgotPassword() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
      <p className="text-gray-500 mb-4">Route: /auth/forgot-password</p>
      <p className="text-gray-600">
        Enter your registered email to receive a password reset link.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
