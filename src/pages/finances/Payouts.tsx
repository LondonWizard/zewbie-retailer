import { useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Wallet } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StatCard } from '../../components/ui/StatCard';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Payout { id: string; amount: number; status: string; period: string; method: string; createdAt: string; }
const col = createColumnHelper<Payout>();

export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingTotal, setPendingTotal] = useState(0);

  useEffect(() => {
    api.get('/v1/retailer/finances/payouts').then((r) => {
      const data = r.data?.payouts ?? r.data ?? [];
      setPayouts(data);
      setPendingTotal(data.filter((p: Payout) => p.status === 'pending').reduce((s: number, p: Payout) => s + p.amount, 0));
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const columns = useMemo(() => [
    col.accessor('id', { header: 'Payout ID', cell: (info) => <span className="font-mono text-xs">{info.getValue().slice(0, 8)}</span> }),
    col.accessor('amount', { header: 'Amount', cell: (info) => <span className="font-medium">${info.getValue()?.toFixed(2)}</span> }),
    col.accessor('period', { header: 'Period' }),
    col.accessor('method', { header: 'Method' }),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.accessor('createdAt', { header: 'Date', cell: (info) => new Date(info.getValue()).toLocaleDateString() }),
  ], []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        {pendingTotal > 0 && <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium"><Wallet size={14} className="inline mr-1" /> ${pendingTotal.toFixed(2)} pending</div>}
      </div>
      <DataTable columns={columns} data={payouts} isLoading={loading} searchKey="period" searchPlaceholder="Search payouts..." />
    </div>
  );
}
