import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2, ImagePlus } from 'lucide-react'
import api from '../../lib/api'
import { CATEGORIES, INPUT_CLASS } from '../../constants'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface Variant {
  name: string
  sku: string
  price: string
  stock: string
}

/** Create a new product listing with details, images, pricing, and variants */
export default function ProductCreate() {
  useDocumentTitle('Create Product')
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    basePrice: '',
    category: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    imageUrl: '',
  })

  const [variants, setVariants] = useState<Variant[]>([])
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([])

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { name: '', sku: '', price: '', stock: '' }])
  }

  function updateVariant(idx: number, field: keyof Variant, value: string) {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)))
  }

  function removeVariant(idx: number) {
    if (!window.confirm('Remove this variant?')) return
    setVariants((prev) => prev.filter((_, i) => i !== idx))
  }

  function addAttribute() {
    setAttributes((prev) => [...prev, { key: '', value: '' }])
  }

  function updateAttribute(idx: number, field: 'key' | 'value', value: string) {
    setAttributes((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a)))
  }

  function removeAttribute(idx: number) {
    if (!window.confirm('Remove this attribute?')) return
    setAttributes((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      const payload = {
        name: form.name,
        sku: form.sku,
        description: form.description,
        basePrice: parseFloat(form.basePrice) || 0,
        category: form.category,
        weight: parseFloat(form.weight) || undefined,
        dimensions: {
          length: parseFloat(form.length) || undefined,
          width: parseFloat(form.width) || undefined,
          height: parseFloat(form.height) || undefined,
        },
        images: form.imageUrl ? [form.imageUrl] : [],
        variants: variants.map((v) => ({
          name: v.name,
          sku: v.sku,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0,
        })),
        attributes: Object.fromEntries(attributes.filter((a) => a.key).map((a) => [a.key, a.value])),
      }
      const res = await api.post('/retailers/me/products', payload)
      navigate(`/products/${res.data.id ?? res.data.data?.id ?? ''}`)
    } catch {
      setError('Failed to create product. Please check all fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/products" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} required className={INPUT_CLASS} placeholder="Product name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input type="text" value={form.sku} onChange={(e) => updateField('sku', e.target.value)} required className={INPUT_CLASS} placeholder="SKU-001" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} className={INPUT_CLASS} placeholder="Product description..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
              <input type="number" step="0.01" min="0" value={form.basePrice} onChange={(e) => updateField('basePrice', e.target.value)} required className={INPUT_CLASS} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className={INPUT_CLASS}>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Weight & Dimensions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weight & Dimensions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (oz)</label>
              <input type="number" step="0.1" min="0" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} className={INPUT_CLASS} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (in)</label>
              <input type="number" step="0.1" min="0" value={form.length} onChange={(e) => updateField('length', e.target.value)} className={INPUT_CLASS} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (in)</label>
              <input type="number" step="0.1" min="0" value={form.width} onChange={(e) => updateField('width', e.target.value)} className={INPUT_CLASS} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (in)</label>
              <input type="number" step="0.1" min="0" value={form.height} onChange={(e) => updateField('height', e.target.value)} className={INPUT_CLASS} placeholder="0" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <div className="flex items-center gap-3">
              <ImagePlus size={18} className="text-gray-400 shrink-0" />
              <input type="url" value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} className={INPUT_CLASS} placeholder="https://example.com/image.jpg" />
            </div>
            <p className="text-xs text-gray-400 mt-1">File upload coming soon. Paste an image URL for now.</p>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Attributes</h2>
            <button type="button" onClick={addAttribute} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus size={14} /> Add Attribute
            </button>
          </div>
          {attributes.length === 0 ? (
            <p className="text-sm text-gray-400">No attributes added. Add custom key-value pairs like Color, Material, etc.</p>
          ) : (
            <div className="space-y-2">
              {attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="text" value={attr.key} onChange={(e) => updateAttribute(idx, 'key', e.target.value)} className={INPUT_CLASS} placeholder="Key (e.g. Color)" />
                  <input type="text" value={attr.value} onChange={(e) => updateAttribute(idx, 'value', e.target.value)} className={INPUT_CLASS} placeholder="Value (e.g. Red)" />
                  <button type="button" onClick={() => removeAttribute(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Variants</h2>
            <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus size={14} /> Add Variant
            </button>
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">No variants. Add size, color, or other variations.</p>
          ) : (
            <div className="space-y-3">
              {variants.map((variant, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input type="text" value={variant.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} className={INPUT_CLASS} placeholder="Name (e.g. Small)" />
                  <input type="text" value={variant.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} className={INPUT_CLASS} placeholder="SKU" />
                  <input type="number" step="0.01" value={variant.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} className={INPUT_CLASS} placeholder="Price" />
                  <input type="number" value={variant.stock} onChange={(e) => updateVariant(idx, 'stock', e.target.value)} className={INPUT_CLASS} placeholder="Stock" />
                  <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Creating...' : 'Create Product'}
          </button>
          <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
