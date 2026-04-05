import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  Clock,
  TrendingUp,
  CheckCircle,
  Package,
  DollarSign,
  RefreshCw,
} from 'lucide-react'
import api from '../../lib/api'
import { Skeleton, ErrorBanner } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface FulfillmentStats {
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  pendingOrders: number
  fulfillmentRate: number
  averageProcessingHours: number
  averageShippingDays: number
  totalRevenue: number
  revenueThisMonth: number
  ordersByStatus: Record<string, number>
}

const FALLBACK: FulfillmentStats = {
  totalOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  pendingOrders: 0,
  fulfillmentRate: 0,
  averageProcessingHours: 0,
  averageShippingDays: 0,
  totalRevenue: 0,
  revenueThisMonth: 0,
  ordersByStatus: {},
}

/** Fulfillment statistics — completion rates, average times, and trends */
export default function OrderStats() {
  useDocumentTitle('Order Statistics')

  const [stats, setStats] = useState<FulfillmentStats>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/me/orders/stats')
      setStats({ ...FALLBACK, ...(res.data.data ?? res.data ?? {}) })
    } catch {
      setError('Failed to load fulfillment statistics')
      setStats(FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  const cards = useMemo(() => [
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Completed', value: stats.completedOrders, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Fulfillment Rate', value: `${stats.fulfillmentRate}%`, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Avg Processing', value: `${stats.averageProcessingHours}h`, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Avg Shipping', value: `${stats.averageShippingDays}d`, icon: Clock, color: 'text-purple-600 bg-purple-50' },
    { label: 'Revenue (month)', value: `$${stats.revenueThisMonth.toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
  ], [stats])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={24} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Fulfillment Statistics</h1>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
              <span className={`p-2 rounded-lg ${card.color}`}>
                <card.icon size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
        {Object.keys(stats.ordersByStatus).length === 0 ? (
          <p className="text-sm text-gray-400">No order data available</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const percentage = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{status}</span>
                    <span className="text-gray-500">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 rounded-full h-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Revenue overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Cancelled Orders</h3>
          <p className="text-3xl font-bold text-red-600">{stats.cancelledOrders}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.totalOrders > 0 ? `${((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)}% cancellation rate` : 'No orders'}
          </p>
        </div>
      </div>
    </div>
  )
}
