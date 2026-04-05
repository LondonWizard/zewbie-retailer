import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, ExternalLink, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface ConnectStatus {
  connected: boolean
  accountId?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  onboardingUrl?: string
}

/** Stripe Connect onboarding for retailers */
export default function PayoutSetup() {
  useDocumentTitle('Payout Setup')
  const [status, setStatus] = useState<ConnectStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/payments/connect/status')
      setStatus(res.data.data ?? res.data)
    } catch {
      setError('Failed to load payout setup status')
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  async function startOnboarding() {
    try {
      setConnecting(true)
      setError('')
      const res = await api.post('/payments/connect/onboard')
      const url = res.data.url ?? res.data.onboardingUrl
      if (url) {
        window.location.href = url
      } else {
        setError('No onboarding URL returned. Please try again.')
      }
    } catch {
      setError('Failed to start Stripe Connect onboarding.')
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-20">
        <Loader2 size={32} className="text-indigo-600 animate-spin" />
      </div>
    )
  }

  const isConnected = status?.connected && status?.payoutsEnabled

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/finances/payouts" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Payout Setup</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Stripe Connect</h2>
            <p className="text-sm text-gray-500">Receive payouts directly to your bank account</p>
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Your account is connected and ready to receive payouts</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Account ID</span>
                <span className="font-mono text-xs text-gray-700">{status?.accountId ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Charges</span>
                <span className={status?.chargesEnabled ? 'text-green-600' : 'text-red-600'}>
                  {status?.chargesEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payouts</span>
                <span className={status?.payoutsEnabled ? 'text-green-600' : 'text-red-600'}>
                  {status?.payoutsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ExternalLink size={14} /> Manage in Stripe Dashboard
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Stripe account to start receiving payouts. You'll be redirected to Stripe
              to complete the onboarding process.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">What you'll need:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Business or personal identification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Bank account details for payouts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Tax information (EIN or SSN)
                </li>
              </ul>
            </div>

            <button
              onClick={startOnboarding}
              disabled={connecting}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {connecting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Connect with Stripe
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
