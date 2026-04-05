import { useState, useEffect } from 'react'
import { Bell, Shield, Key, Save, Mail, Eye, EyeOff } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface AccountSettings {
  email: string
  notifications: {
    orderUpdates: boolean
    payoutAlerts: boolean
    inventoryAlerts: boolean
    marketing: boolean
  }
  twoFactorEnabled: boolean
}

const DEFAULTS: AccountSettings = {
  email: '',
  notifications: {
    orderUpdates: true,
    payoutAlerts: true,
    inventoryAlerts: true,
    marketing: false,
  },
  twoFactorEnabled: false,
}

/** Account settings — email, password, notifications, and security */
export default function Settings() {
  useDocumentTitle('Account Settings')
  const [settings, setSettings] = useState<AccountSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' })
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

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

  async function fetchSettings() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/auth/me')
      const data = res.data.data ?? res.data
      setSettings({
        email: data.email ?? '',
        notifications: data.notifications ?? DEFAULTS.notifications,
        twoFactorEnabled: data.twoFactorEnabled ?? false,
      })
    } catch {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  function toggleNotification(key: keyof AccountSettings['notifications']) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }))
  }

  async function saveNotifications(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await api.patch('/retailers/me/settings', { notifications: settings.notifications })
      setSuccess('Settings saved')
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError('Passwords do not match')
      return
    }
    try {
      setChangingPassword(true)
      setPasswordError('')
      setPasswordSuccess('')
      await api.post('/retailers/auth/change-password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPassword,
      })
      setPasswordSuccess('Password changed successfully')
      setPasswordForm({ current: '', newPassword: '', confirm: '' })
    } catch {
      setPasswordError('Failed to change password. Check your current password.')
    } finally {
      setChangingPassword(false)
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const notificationOptions: { key: keyof AccountSettings['notifications']; label: string; description: string }[] = [
    { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified when orders are placed or updated' },
    { key: 'payoutAlerts', label: 'Payout Alerts', description: 'Notifications about payout status changes' },
    { key: 'inventoryAlerts', label: 'Inventory Alerts', description: 'Low stock and out-of-stock warnings' },
    { key: 'marketing', label: 'Marketing', description: 'Tips, news, and feature announcements' },
  ]

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{success}</div>}

      {/* Account info */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail size={18} /> Account
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={settings.email} disabled className={`${inputClass} bg-gray-50 text-gray-500`} />
          <p className="text-xs text-gray-400 mt-1">Contact support to change your email</p>
        </div>
      </div>

      {/* Notifications */}
      <form onSubmit={saveNotifications}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={18} /> Notifications
          </h2>
          <div className="space-y-3">
            {notificationOptions.map((opt) => (
              <label key={opt.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications[opt.key]}
                  onChange={() => toggleNotification(opt.key)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form onSubmit={changePassword}>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Key size={18} /> Change Password
          </h2>

          {passwordError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">{passwordError}</div>}
          {passwordSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-3">{passwordSuccess}</div>}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={8}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Key size={14} /> {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>

      {/* Security */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={18} /> Security
        </h2>
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            settings.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </div>
  )
}
