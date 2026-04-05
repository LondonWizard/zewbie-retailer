import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  RefreshCw,
} from 'lucide-react'
import api from '../lib/api'
import { statusBadge, Skeleton, ErrorBanner } from '../components/shared'
import useDocumentTitle from '../hooks/useDocumentTitle'

interface DashboardStats {
  pendingOrders: number
  revenue30d: number
  fulfillmentRate: number
  activeProducts: number
  inventoryAlerts: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

const FALLBACK_STATS: DashboardStats = {
  pendingOrders: 0,
  revenue30d: 0,
  fulfillmentRate: 0,
  activeProducts: 0,
  inventoryAlerts: 0,
}

/** Retailer dashboard with key performance widgets, recent orders, and quick actions */
export default function Dashboard() {
  useDocumentTitle('Dashboard')

  const [stats, setStats] = useState<DashboardStats>(FALLBACK_STATS)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/me/dashboard')
      setStats(res.data.stats ?? FALLBACK_STATS)
      setRecentOrders(res.data.recentOrders ?? [])
    } catch {
      setError('Failed to load dashboard data')
      setStats(FALLBACK_STATS)
      setRecentOrders([])
    } finally {
      setLoading(false)
    }
  }

  const statCards = useMemo(() => [
    { label: 'Pending Orders', value: stats.pendingOrders, icon: ShoppingCart, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Revenue (30d)', value: `$${stats.revenue30d.toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Fulfillment Rate', value: `${stats.fulfillmentRate}%`, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Products', value: stats.activeProducts, icon: Package, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Inventory Alerts', value: stats.inventoryAlerts, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  ], [stats])

  const quickActions = [
    { label: 'Add Product', to: '/products/new', icon: Package },
    { label: 'View Orders', to: '/orders', icon: ShoppingCart },
    { label: 'Manage Inventory', to: '/inventory', icon: AlertTriangle },
    { label: 'Revenue Report', to: '/finances/revenue', icon: DollarSign },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <Skeleton className="h-5 w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingCart size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No recent orders</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.orderNumber || `#${order.id.slice(0, 8)}`}
                    </p>
                    <p className="text-xs text-gray-500">{order.customerName ?? 'Customer'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      ${order.total?.toFixed(2) ?? '0.00'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-3 space-y-1">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <action.icon size={18} />
                {action.label}
                <ArrowRight size={14} className="ml-auto text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
