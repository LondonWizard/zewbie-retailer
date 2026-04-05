import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

/** Email verification handler — validates the token and confirms the account */
export default function VerifyEmail() {
  useDocumentTitle('Verify Email')
  const { token } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyEmail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function verifyEmail() {
    try {
      setStatus('loading')
      await api.post('/retailers/auth/verify-email', { token })
      setStatus('success')
      setMessage('Your email has been verified successfully.')
    } catch {
      setStatus('error')
      setMessage('Verification failed. The link may be expired or invalid.')
    }
  }

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader2 size={36} className="mx-auto text-indigo-600 mb-3 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Email</h2>
          <p className="text-sm text-gray-500">Please wait while we verify your email address...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={36} className="mx-auto text-green-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Continue to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle size={36} className="mx-auto text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="space-x-4">
            <button
              onClick={verifyEmail}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Try Again
            </button>
            <Link
              to="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Go to Login
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
