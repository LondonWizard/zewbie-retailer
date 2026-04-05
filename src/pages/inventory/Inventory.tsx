import { useState, useEffect } from 'react'
import { AlertTriangle, Search, Save, Package, RefreshCw } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  variantName?: string
  stock: number
  lowStockThreshold: number
}

/** Inventory stock level management across all products */
export default function Inventory() {
  useDocumentTitle('Inventory')
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState('')
  const [saving, setSaving] = useState(false)
  const [showLowOnly, setShowLowOnly] = useState(false)

  useEffect(() => {
    fetchInventory()
  }, [])

  async function fetchInventory() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/me/products')
      const products = res.data.data ?? res.data ?? []
      const mapped: InventoryItem[] = products.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        productId: p.id as string,
        productName: (p.name as string) ?? '',
        sku: (p.sku as string) ?? '',
        stock: (p.stock as number) ?? 0,
        lowStockThreshold: (p.lowStockThreshold as number) ?? 10,
      }))
      setItems(mapped)
    } catch {
      setError('Failed to load inventory')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function saveStock(item: InventoryItem) {
    try {
      setSaving(true)
      setError('')
      await api.patch(`/retailers/me/products/${item.productId}`, {
        stock: parseInt(editStock) || 0,
      })
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, stock: parseInt(editStock) || 0 } : i
        )
      )
      setEditingId(null)
    } catch {
      setError('Failed to update stock')
    } finally {
      setSaving(false)
    }
  }

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
    const matchesLow = !showLowOnly || item.stock <= item.lowStockThreshold
    return matchesSearch && matchesLow
  })

  const lowStockCount = items.filter((i) => i.stock <= i.lowStockThreshold).length

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          <strong>{lowStockCount}</strong> product{lowStockCount !== 1 ? 's' : ''} with low stock
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowLowOnly(!showLowOnly)}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            showLowOnly
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-1">
            <AlertTriangle size={14} /> Low Stock Only
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              {items.length === 0 ? 'No products in inventory' : 'No products match your filters'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">SKU</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Threshold</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{item.sku}</td>
                  <td className="px-4 py-3 text-right">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:ring-2 focus:ring-indigo-500 outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className={item.stock <= item.lowStockThreshold ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                        {item.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{item.lowStockThreshold}</td>
                  <td className="px-4 py-3">
                    {item.stock === 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">Out of stock</span>
                    ) : item.stock <= item.lowStockThreshold ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Low stock</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">In stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => saveStock(item)}
                          disabled={saving}
                          className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          aria-label={`Save stock for ${item.productName}`}
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(item.id); setEditStock(String(item.stock)) }}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        aria-label={`Edit stock for ${item.productName}`}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
