import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

/** Forgot password form — sends a reset link to the retailer's email */
export default function ForgotPassword() {
  useDocumentTitle('Forgot Password')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await api.post('/retailers/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError('Failed to send reset email. Please verify your address.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <CheckCircle size={36} className="mx-auto text-green-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500 mb-6">
          We sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-6">
        <Mail size={28} className="mx-auto text-indigo-600 mb-2" />
        <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-sm text-gray-500">Enter your email to receive a reset link</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
          <Send size={14} />
        </button>
      </form>

      <p className="text-center mt-6">
        <Link to="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </p>
    </div>
  )
}
