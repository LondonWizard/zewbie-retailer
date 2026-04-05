import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, CheckCircle, Clock, AlertCircle, RefreshCw, Settings } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface Payout {
  id: string
  amount: number
  currency: string
  status: string
  method: string
  createdAt: string
  arrivedAt?: string
}

function statusBadge(status: string) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'in_transit': return 'bg-blue-100 text-blue-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function statusIcon(status: string) {
  switch (status) {
    case 'paid': return <CheckCircle size={14} className="text-green-600" />
    case 'pending': return <Clock size={14} className="text-yellow-600" />
    case 'failed': return <AlertCircle size={14} className="text-red-600" />
    default: return <Clock size={14} className="text-gray-400" />
  }
}

/** Payout history — list of completed and pending payouts */
export default function Payouts() {
  useDocumentTitle('Payouts')
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPayouts()
  }, [])

  async function fetchPayouts() {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/payments/payouts')
      setPayouts(res.data.data ?? res.data ?? [])
    } catch {
      setError('Failed to load payout history')
      setPayouts([])
    } finally {
      setLoading(false)
    }
  }

  const totalPaid = payouts.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payouts.filter((p) => p.status === 'pending' || p.status === 'in_transit').reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/finances/payouts/setup"
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Settings size={14} /> Payout Settings
          </Link>
          <button
            onClick={fetchPayouts}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Total Paid</span>
            <span className="p-2 rounded-lg text-green-600 bg-green-50"><DollarSign size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Pending</span>
            <span className="p-2 rounded-lg text-yellow-600 bg-yellow-50"><Clock size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Payout table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {payouts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <DollarSign size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-2">No payouts yet</p>
            <Link to="/finances/payouts/setup" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Set up your payout method
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Arrived</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${payout.amount.toFixed(2)} {payout.currency?.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{payout.method ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(payout.status)}`}>
                      {statusIcon(payout.status)}
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {payout.arrivedAt ? new Date(payout.arrivedAt).toLocaleDateString() : '—'}
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
