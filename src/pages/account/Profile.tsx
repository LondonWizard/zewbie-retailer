import { useState, useEffect } from 'react'
import { Store, Save, MapPin, ImagePlus } from 'lucide-react'
import api from '../../lib/api'
import { INPUT_CLASS } from '../../constants'
import { ErrorBanner, SuccessBanner, Skeleton } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface BusinessProfile {
  businessName: string
  contactName: string
  email: string
  phone: string
  website: string
  description: string
  logo: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

const EMPTY_PROFILE: BusinessProfile = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  description: '',
  logo: '',
  address: { street: '', city: '', state: '', zip: '', country: '' },
}

/** Business profile management — company info, logo, and contact details */
export default function Profile() {
  useDocumentTitle('Business Profile')
  const [form, setForm] = useState<BusinessProfile>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/auth/me')
      const data = res.data.data ?? res.data
      setForm({
        businessName: data.businessName ?? '',
        contactName: data.contactName ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        website: data.website ?? '',
        description: data.description ?? '',
        logo: data.logo ?? '',
        address: {
          street: data.address?.street ?? '',
          city: data.address?.city ?? '',
          state: data.address?.state ?? '',
          zip: data.address?.zip ?? '',
          country: data.address?.country ?? '',
        },
      })
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(''), 5000)
    return () => clearTimeout(timer)
  }, [success])

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(''), 5000)
    return () => clearTimeout(timer)
  }, [error])

  function updateField(field: keyof BusinessProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateAddress(field: string, value: string) {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await api.patch('/retailers/me/profile', form)
      setSuccess('Profile updated successfully')
    } catch {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Store size={24} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
      {success && <div className="mb-4"><SuccessBanner message={success} /></div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input type="text" value={form.businessName} onChange={(e) => updateField('businessName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input type="text" value={form.contactName} onChange={(e) => updateField('contactName', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.website} onChange={(e) => updateField('website', e.target.value)} className={INPUT_CLASS} placeholder="https://" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} className={INPUT_CLASS} />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
          <div className="flex items-center gap-4">
            {form.logo ? (
              <img src={form.logo} alt="Business logo" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                <Store size={24} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <div className="flex items-center gap-2">
                <ImagePlus size={16} className="text-gray-400 shrink-0" />
                <input type="url" value={form.logo} onChange={(e) => updateField('logo', e.target.value)} className={INPUT_CLASS} placeholder="https://example.com/logo.png" />
              </div>
              <p className="text-xs text-gray-400 mt-1">File upload coming soon</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} /> Business Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input type="text" value={form.address.street} onChange={(e) => updateAddress('street', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={form.address.city} onChange={(e) => updateAddress('city', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" value={form.address.state} onChange={(e) => updateAddress('state', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input type="text" value={form.address.zip} onChange={(e) => updateAddress('zip', e.target.value)} className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" value={form.address.country} onChange={(e) => updateAddress('country', e.target.value)} className={INPUT_CLASS} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
