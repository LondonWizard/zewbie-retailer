import { useParams } from 'react-router-dom'

/** Password reset form — uses token from URL to authorize the change */
export default function ResetPassword() {
  const { token } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
      <p className="text-gray-500 mb-4">Route: /auth/reset-password/:token</p>
      <p className="text-gray-600">
        Set a new password using reset token: <code className="text-xs bg-gray-100 px-1 rounded">{token}</code>
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
