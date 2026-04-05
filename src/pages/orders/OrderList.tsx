import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, XCircle, Eye, ShoppingCart, Filter } from 'lucide-react'
import api from '../../lib/api'
import { statusBadge, Skeleton, ErrorBanner } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  itemCount: number
  createdAt: string
}

const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled']

/** Orders list — incoming orders to fulfill */
export default function OrderList() {
  useDocumentTitle('Orders')

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/me/orders')
      setOrders(res.data.data ?? res.data ?? [])
    } catch {
      setError('Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    if (status === 'cancelled' && !window.confirm('Are you sure you want to reject this order?')) {
      return
    }
    try {
      setActionLoading(orderId)
      await api.patch(`/retailers/me/orders/${orderId}`, { status })
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
    } catch {
      setError(`Failed to update order ${orderId}`)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      (o.orderNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      {error && <ErrorBanner message={error} onRetry={fetchOrders} />}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Items</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {order.orderNumber || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{order.customerName ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{order.itemCount ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${order.total?.toFixed(2) ?? '0.00'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            disabled={actionLoading === order.id}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            aria-label={`Accept order ${order.orderNumber || order.id}`}
                            title="Accept"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            disabled={actionLoading === order.id}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            aria-label={`Reject order ${order.orderNumber || order.id}`}
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                        aria-label={`View order ${order.orderNumber || order.id}`}
                        title="View details"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
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
