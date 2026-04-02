import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { ShoppingCart, Clock, CheckCircle, Package } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface SubOrder { id: string; orderId: string; productName: string; quantity: number; total: number; status: string; customerName: string; createdAt: string; }
const col = createColumnHelper<SubOrder>();

const STATUS_TABS = ['all', 'pending', 'accepted', 'processing', 'manufacturing', 'shipped', 'completed'];

/** Order listing with stat cards, status filter tabs, and empty state */
export default function OrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/v1/retailer/orders').then((r) => setOrders(r.data?.orders ?? r.data ?? [])).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter), [orders, statusFilter]);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeCount = orders.filter(o => ['accepted', 'processing', 'manufacturing'].includes(o.status)).length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  const columns = useMemo(() => [
    col.accessor('id', { header: 'Sub-Order ID', cell: (info) => <span className="font-mono text-xs text-gray-900 dark:text-gray-100">{info.getValue().slice(0, 8)}...</span> }),
    col.accessor('productName', { header: 'Product', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('customerName', { header: 'Customer', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('quantity', { header: 'Qty', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('total', { header: 'Total', cell: (info) => <span className="font-medium text-gray-900 dark:text-gray-100">${info.getValue()?.toFixed(2)}</span> }),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.accessor('createdAt', { header: 'Date', cell: (info) => <span className="text-gray-500 dark:text-gray-400">{new Date(info.getValue()).toLocaleDateString()}</span> }),
    col.display({ id: 'actions', header: '', cell: ({ row }) => (
      <button onClick={() => navigate(`/orders/${row.original.id}`)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">View</button>
    )}),
  ], [navigate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track customer orders</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Pending" value={pendingCount} icon={Clock} color="orange" />
        <StatCard title="In Progress" value={activeCount} icon={ShoppingCart} color="blue" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle} color="green" />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${statusFilter === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No orders yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Orders will appear here when customers purchase your products.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="productName" searchPlaceholder="Search orders..." />
      )}
    </div>
  );
}
