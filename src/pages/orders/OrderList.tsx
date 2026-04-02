import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface SubOrder { id: string; orderId: string; productName: string; quantity: number; total: number; status: string; customerName: string; createdAt: string; }
const col = createColumnHelper<SubOrder>();

export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/v1/retailer/orders').then((r) => setOrders(r.data?.orders ?? r.data ?? [])).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter), [orders, statusFilter]);

  const columns = useMemo(() => [
    col.accessor('id', { header: 'Sub-Order ID', cell: (info) => <span className="font-mono text-xs">{info.getValue().slice(0, 8)}...</span> }),
    col.accessor('productName', { header: 'Product' }),
    col.accessor('customerName', { header: 'Customer' }),
    col.accessor('quantity', { header: 'Qty' }),
    col.accessor('total', { header: 'Total', cell: (info) => <span className="font-medium">${info.getValue()?.toFixed(2)}</span> }),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.accessor('createdAt', { header: 'Date', cell: (info) => new Date(info.getValue()).toLocaleDateString() }),
    col.display({ id: 'actions', header: '', cell: ({ row }) => (
      <button onClick={() => navigate(`/orders/${row.original.id}`)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View</button>
    )}),
  ], [navigate]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="productName" searchPlaceholder="Search orders..."
        toolbar={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">All Status</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="processing">Processing</option><option value="manufacturing">Manufacturing</option><option value="shipped">Shipped</option><option value="completed">Completed</option>
          </select>
        }
      />
    </div>
  );
}
