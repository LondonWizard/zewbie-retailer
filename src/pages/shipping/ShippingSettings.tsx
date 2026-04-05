import { useState, useEffect } from 'react'
import { Truck, Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface ShippingConfig {
  carriers: { name: string; enabled: boolean }[]
  defaultPackaging: string
  handlingTimeDays: number
  freeShippingThreshold: number
  flatRate: number
}

const AVAILABLE_CARRIERS = ['UPS', 'FedEx', 'USPS', 'DHL']

const FALLBACK: ShippingConfig = {
  carriers: AVAILABLE_CARRIERS.map((c) => ({ name: c, enabled: false })),
  defaultPackaging: 'box',
  handlingTimeDays: 1,
  freeShippingThreshold: 0,
  flatRate: 0,
}

/** Shipping configuration — carriers, packaging, and handling time */
export default function ShippingSettings() {
  useDocumentTitle('Shipping Settings')
  const [config, setConfig] = useState<ShippingConfig>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customZones, setCustomZones] = useState<{ name: string; rate: string }[]>([])

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
      const res = await api.get('/retailers/me/shipping')
      const data = res.data.data ?? res.data
      if (data) {
        setConfig({ ...FALLBACK, ...data })
        setCustomZones(data.zones ?? [])
      }
    } catch {
      setConfig(FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  function toggleCarrier(name: string) {
    setConfig((prev) => ({
      ...prev,
      carriers: prev.carriers.map((c) =>
        c.name === name ? { ...c, enabled: !c.enabled } : c
      ),
    }))
  }

  function addZone() {
    setCustomZones((prev) => [...prev, { name: '', rate: '' }])
  }

  function updateZone(idx: number, field: 'name' | 'rate', value: string) {
    setCustomZones((prev) => prev.map((z, i) => (i === idx ? { ...z, [field]: value } : z)))
  }

  function removeZone(idx: number) {
    setCustomZones((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await api.put('/retailers/me/shipping', {
        ...config,
        zones: customZones,
      })
      setSuccess('Shipping settings saved')
    } catch {
      setError('Failed to save shipping settings')
    } finally {
      setSaving(false)
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

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Truck size={24} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Shipping Settings</h1>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Carriers */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Carrier Preferences</h2>
          <div className="space-y-2">
            {config.carriers.map((carrier) => (
              <label key={carrier.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={carrier.enabled}
                  onChange={() => toggleCarrier(carrier.name)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Truck size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{carrier.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Packaging & handling */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Packaging & Handling</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Packaging</label>
              <select
                value={config.defaultPackaging}
                onChange={(e) => setConfig((prev) => ({ ...prev, defaultPackaging: e.target.value }))}
                className={inputClass}
              >
                <option value="box">Box</option>
                <option value="envelope">Envelope</option>
                <option value="bag">Poly Bag</option>
                <option value="tube">Tube</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handling Time (days)</label>
              <input
                type="number"
                min="0"
                value={config.handlingTimeDays}
                onChange={(e) => setConfig((prev) => ({ ...prev, handlingTimeDays: parseInt(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flat Rate ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.flatRate}
                onChange={(e) => setConfig((prev) => ({ ...prev, flatRate: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.freeShippingThreshold}
                onChange={(e) => setConfig((prev) => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
                placeholder="0 = no free shipping"
              />
            </div>
          </div>
        </div>

        {/* Shipping zones */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Custom Shipping Zones</h2>
            <button type="button" onClick={addZone} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus size={14} /> Add Zone
            </button>
          </div>
          {customZones.length === 0 ? (
            <p className="text-sm text-gray-400">No custom zones. Using flat rate or carrier calculated rates.</p>
          ) : (
            <div className="space-y-2">
              {customZones.map((zone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={zone.name} onChange={(e) => updateZone(idx, 'name', e.target.value)} className={inputClass} placeholder="Zone name (e.g. West Coast)" />
                  <input type="text" value={zone.rate} onChange={(e) => updateZone(idx, 'rate', e.target.value)} className={inputClass} placeholder="Rate ($)" />
                  <button type="button" onClick={() => removeZone(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
