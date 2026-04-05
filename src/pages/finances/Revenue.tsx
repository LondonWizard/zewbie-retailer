import { useState, useEffect, useMemo } from 'react'
import { DollarSign, TrendingUp, BarChart3, Calendar, RefreshCw } from 'lucide-react'
import api from '../../lib/api'
import { Skeleton, ErrorBanner } from '../../components/shared'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface RevenueData {
  totalRevenue: number
  revenueThisMonth: number
  revenueLastMonth: number
  commission: number
  commissionRate: number
  netEarnings: number
  monthlyTrend: { month: string; revenue: number; commission: number }[]
  topProducts: { name: string; revenue: number; units: number }[]
}

const FALLBACK: RevenueData = {
  totalRevenue: 0,
  revenueThisMonth: 0,
  revenueLastMonth: 0,
  commission: 0,
  commissionRate: 0,
  netEarnings: 0,
  monthlyTrend: [],
  topProducts: [],
}

/** Revenue analytics — charts and breakdowns of earnings */
export default function Revenue() {
  useDocumentTitle('Revenue')

  const [data, setData] = useState<RevenueData>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRevenue()
  }, [])

  async function fetchRevenue() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/retailers/me/dashboard')
      setData({ ...FALLBACK, ...(res.data.revenue ?? res.data ?? {}) })
    } catch {
      setError('Failed to load revenue data')
      setData(FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  const growthPercent = data.revenueLastMonth > 0
    ? (((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth) * 100).toFixed(1)
    : '0'

  const statCards = useMemo(() => [
    { label: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'This Month', value: `$${data.revenueThisMonth.toLocaleString()}`, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Growth', value: `${growthPercent}%`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Commission', value: `$${data.commission.toLocaleString()} (${data.commissionRate}%)`, icon: BarChart3, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Net Earnings', value: `$${data.netEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  ], [data, growthPercent])

  const maxRevenue = useMemo(
    () => Math.max(...data.monthlyTrend.map((m) => m.revenue), 1),
    [data.monthlyTrend]
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
        <button
          onClick={fetchRevenue}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Monthly trend */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
        {data.monthlyTrend.length === 0 ? (
          <div className="text-center py-10">
            <BarChart3 size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No revenue data available yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.monthlyTrend.map((month) => {
              const width = (month.revenue / maxRevenue) * 100
              return (
                <div key={month.month}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{month.month}</span>
                    <span className="text-gray-900 font-medium">${month.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-indigo-600 rounded-full h-3 transition-all" style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Top products by revenue */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
        {data.topProducts.length === 0 ? (
          <p className="text-sm text-gray-400">No product revenue data</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-500">Product</th>
                <th className="text-right py-2 font-medium text-gray-500">Units</th>
                <th className="text-right py-2 font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.topProducts.map((product) => (
                <tr key={product.name}>
                  <td className="py-2 text-gray-900">{product.name}</td>
                  <td className="py-2 text-right text-gray-700">{product.units}</td>
                  <td className="py-2 text-right font-medium text-gray-900">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
