import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, ArrowRight, CheckCircle } from 'lucide-react'
import api from '../../lib/api'
import { INPUT_CLASS } from '../../constants'
import useDocumentTitle from '../../hooks/useDocumentTitle'

/** Multi-step retailer onboarding wizard — collects core business info */
export default function Onboarding() {
  useDocumentTitle('Onboarding')

  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await api.post('/retailers/me/onboarding', form)
      setDone(true)
    } catch {
      setError('Failed to save onboarding info. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Onboarding Complete</h2>
        <p className="text-sm text-gray-500 mb-6">You're all set to start selling.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Store size={24} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Retailer Onboarding</h1>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Tell us about your business to get started on the platform.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            required
            className={INPUT_CLASS}
            placeholder="Acme Inc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
            className={INPUT_CLASS}
            placeholder="contact@acme.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={INPUT_CLASS}
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className={INPUT_CLASS}
            placeholder="Tell us what you sell..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Onboarding'}
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  )
}
