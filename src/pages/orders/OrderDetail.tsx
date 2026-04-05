import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Save,
  XCircle,
} from 'lucide-react'
import api from '../../lib/api'
import { ErrorBanner, SuccessBanner, Skeleton } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface OrderItem {
  id: string
  productName: string
  sku: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  customerName: string
  customerEmail: string
  shippingAddress: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
  items: OrderItem[]
  trackingNumber: string
  carrier: string
  createdAt: string
  updatedAt: string
  timeline: { status: string; timestamp: string; note?: string }[]
}

const STATUS_FLOW = ['pending', 'accepted', 'processing', 'shipped', 'delivered']

function statusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock size={16} className="text-yellow-500" />
    case 'accepted': return <CheckCircle size={16} className="text-blue-500" />
    case 'processing': return <Package size={16} className="text-indigo-500" />
    case 'shipped': return <Truck size={16} className="text-purple-500" />
    case 'delivered': return <CheckCircle size={16} className="text-green-500" />
    case 'cancelled': return <XCircle size={16} className="text-red-500" />
    default: return <Clock size={16} className="text-gray-400" />
  }
}

/** Order detail with timeline, customer info, and shipping actions */
export default function OrderDetail() {
  const { id } = useParams()
  useDocumentTitle('Order Detail')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchOrder()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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

  async function fetchOrder() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get(`/retailers/me/orders/${id}`)
      const data = res.data.data ?? res.data
      setOrder(data)
      setTrackingNumber(data.trackingNumber ?? '')
      setCarrier(data.carrier ?? '')
    } catch {
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(newStatus: string) {
    if (newStatus === 'cancelled' && !window.confirm('Are you sure you want to cancel this order?')) {
      return
    }
    try {
      setUpdating(true)
      setError('')
      setSuccess('')
      const payload: Record<string, string> = { status: newStatus }
      if (newStatus === 'shipped' && trackingNumber) {
        payload.trackingNumber = trackingNumber
        payload.carrier = carrier
      }
      await api.patch(`/retailers/me/orders/${id}`, payload)
      setSuccess(`Order updated to ${newStatus}`)
      fetchOrder()
    } catch {
      setError('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const currentIdx = order ? STATUS_FLOW.indexOf(order.status) : -1
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : undefined

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <ErrorBanner message={error || 'Order not found'} onRetry={fetchOrder} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="text-gray-400 hover:text-gray-600" aria-label="Back to orders">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order {order.orderNumber || `#${order.id.slice(0, 8)}`}
          </h1>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
      {success && <div className="mb-4"><SuccessBanner message={success} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {(order.items ?? []).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku} &middot; Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              {(!order.items || order.items.length === 0) && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">No items</div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>${(order.subtotal ?? order.total ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span><span>${(order.shippingCost ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span><span>${(order.tax ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span><span>${(order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping / Tracking */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g. 1Z999AA10123456784"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Select carrier</option>
                    <option value="ups">UPS</option>
                    <option value="fedex">FedEx</option>
                    <option value="usps">USPS</option>
                    <option value="dhl">DHL</option>
                  </select>
                </div>
              </div>
              {nextStatus && (
                <button
                  onClick={() => updateStatus(nextStatus)}
                  disabled={updating}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save size={14} />
                  {updating ? 'Updating...' : `Mark as ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`}
                </button>
              )}
            </div>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {statusIcon(event.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                        {event.note && ` — ${event.note}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — customer info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={16} /> Customer
            </h2>
            <p className="text-sm font-medium text-gray-900">{order.customerName ?? '—'}</p>
            <p className="text-sm text-gray-500">{order.customerEmail ?? '—'}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={16} /> Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-700 space-y-0.5">
                {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                <p>
                  {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No address provided</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={16} /> Dates
            </h2>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
