import { useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DollarSign, Clock, CheckCircle, Calendar } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Payout { id: string; amount: number; status: string; period: string; method: string; createdAt: string; }
const col = createColumnHelper<Payout>();

/** Payouts listing with stat cards, status badges, and date filter */
export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    api.get('/v1/retailer/finances/payouts').then((r) => {
      setPayouts(r.data?.payouts ?? r.data ?? []);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const totalEarned = useMemo(() => payouts.reduce((s, p) => s + p.amount, 0), [payouts]);
  const pendingTotal = useMemo(() => payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0), [payouts]);
  const paidTotal = useMemo(() => payouts.filter(p => p.status === 'paid' || p.status === 'completed').reduce((s, p) => s + p.amount, 0), [payouts]);

  const filtered = useMemo(() => {
    if (dateFilter === 'all') return payouts;
    const now = new Date();
    const cutoff = new Date();
    if (dateFilter === '30d') cutoff.setDate(now.getDate() - 30);
    else if (dateFilter === '90d') cutoff.setDate(now.getDate() - 90);
    else if (dateFilter === '1y') cutoff.setFullYear(now.getFullYear() - 1);
    return payouts.filter(p => new Date(p.createdAt) >= cutoff);
  }, [payouts, dateFilter]);

  const columns = useMemo(() => [
    col.accessor('id', { header: 'Payout ID', cell: (info) => <span className="font-mono text-xs text-gray-900 dark:text-gray-100">{info.getValue().slice(0, 8)}</span> }),
    col.accessor('amount', { header: 'Amount', cell: (info) => <span className="font-medium text-gray-900 dark:text-gray-100">${info.getValue()?.toFixed(2)}</span> }),
    col.accessor('period', { header: 'Period', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('method', { header: 'Method', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.accessor('createdAt', { header: 'Date', cell: (info) => <span className="text-gray-500 dark:text-gray-400">{new Date(info.getValue()).toLocaleDateString()}</span> }),
  ], []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payouts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your earnings and payment history</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <Calendar size={14} className="text-gray-400 ml-2" />
          {[{ v: 'all', l: 'All' }, { v: '30d', l: '30D' }, { v: '90d', l: '90D' }, { v: '1y', l: '1Y' }].map((r) => (
            <button key={r.v} onClick={() => setDateFilter(r.v)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${dateFilter === r.v ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Earned" value={`$${totalEarned.toFixed(2)}`} icon={DollarSign} color="green" />
        <StatCard title="Pending" value={`$${pendingTotal.toFixed(2)}`} icon={Clock} color="orange" />
        <StatCard title="Paid Out" value={`$${paidTotal.toFixed(2)}`} icon={CheckCircle} color="blue" />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="period" searchPlaceholder="Search payouts..." />
    </div>
  );
}
