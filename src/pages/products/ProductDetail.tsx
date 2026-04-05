import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Package, ImagePlus } from 'lucide-react'
import api from '../../lib/api'
import { INPUT_CLASS } from '../../constants'
import { ErrorBanner, SuccessBanner, Skeleton } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface ProductVariant {
  id?: string
  name: string
  sku: string
  price: number
  stock: number
}

interface Product {
  id: string
  name: string
  sku: string
  description: string
  basePrice: number
  category: string
  weight: number
  dimensions: { length?: number; width?: number; height?: number }
  images: string[]
  status: string
  stock: number
  variants: ProductVariant[]
  attributes: Record<string, string>
}

/** Product detail and edit view */
export default function ProductDetail() {
  useDocumentTitle('Product Detail')
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(false)

  const [form, setForm] = useState({
    name: '', sku: '', description: '', basePrice: '', category: '',
    weight: '', stock: '', imageUrl: '',
  })
  const [variants, setVariants] = useState<ProductVariant[]>([])

  useEffect(() => {
    fetchProduct()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchProduct() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/retailers/me/products/${id}`)
      const p: Product = res.data.data ?? res.data
      setProduct(p)
      setForm({
        name: p.name ?? '',
        sku: p.sku ?? '',
        description: p.description ?? '',
        basePrice: String(p.basePrice ?? ''),
        category: p.category ?? '',
        weight: String(p.weight ?? ''),
        stock: String(p.stock ?? ''),
        imageUrl: p.images?.[0] ?? '',
      })
      setVariants(p.variants ?? [])
    } catch {
      setError('Failed to load product')
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

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { name: '', sku: '', price: 0, stock: 0 }])
  }

  function updateVariant(idx: number, field: keyof ProductVariant, value: string) {
    setVariants((prev) => prev.map((v, i) =>
      i === idx ? { ...v, [field]: field === 'price' || field === 'stock' ? Number(value) : value } : v
    ))
  }

  function removeVariant(idx: number) {
    if (!window.confirm('Remove this variant?')) return
    setVariants((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      await api.patch(`/retailers/me/products/${id}`, {
        name: form.name,
        sku: form.sku,
        description: form.description,
        basePrice: parseFloat(form.basePrice) || 0,
        category: form.category,
        weight: parseFloat(form.weight) || 0,
        stock: parseInt(form.stock) || 0,
        images: form.imageUrl ? [form.imageUrl] : product?.images ?? [],
        variants,
      })
      setSuccess('Product updated successfully')
      setEditing(false)
      fetchProduct()
    } catch {
      setError('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      </div>
    )
  }

  if (!product && error) {
    return (
      <div className="p-6">
        <ErrorBanner message={error} onRetry={fetchProduct} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/products" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{product?.name ?? 'Product Detail'}</h1>
          {product?.status && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {product.status}
            </span>
          )}
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            Edit Product
          </button>
        )}
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
      {success && <div className="mb-4"><SuccessBanner message={success} /></div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" value={form.sku} onChange={(e) => updateField('sku', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} disabled={!editing} rows={3} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
              <input type="number" step="0.01" value={form.basePrice} onChange={(e) => updateField('basePrice', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => updateField('category', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (oz)</label>
              <input type="number" step="0.1" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-50 disabled:text-gray-500`} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          {product?.images && product.images.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt={`Product ${i + 1}`} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
              ))}
            </div>
          )}
          {editing && (
            <div className="flex items-center gap-3">
              <ImagePlus size={18} className="text-gray-400 shrink-0" />
              <input type="url" value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} className={INPUT_CLASS} placeholder="Add image URL" />
            </div>
          )}
          {!editing && (!product?.images || product.images.length === 0) && (
            <p className="text-sm text-gray-400 flex items-center gap-2"><Package size={16} /> No images</p>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Variants</h2>
            {editing && (
              <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                <Plus size={14} /> Add Variant
              </button>
            )}
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">No variants</p>
          ) : (
            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input type="text" value={v.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-100`} placeholder="Name" />
                  <input type="text" value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-100`} placeholder="SKU" />
                  <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-100`} placeholder="Price" />
                  <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', e.target.value)} disabled={!editing} className={`${INPUT_CLASS} disabled:bg-gray-100`} placeholder="Stock" />
                  {editing && (
                    <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => { setEditing(false); fetchProduct() }} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
