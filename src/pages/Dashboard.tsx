import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, DollarSign, Star, AlertTriangle, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageSkeleton } from '../components/ui/PageSkeleton';
import api from '../lib/api';
import { toast } from 'sonner';

interface DashStats { activeOrders: number; pendingOrders: number; monthRevenue: number; qualityScore: number; }

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashStats>({ activeOrders: 0, pendingOrders: 0, monthRevenue: 0, qualityScore: 0 });
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; productName: string; total: number; status: string; createdAt: string }>>([]);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string }>>([]);

  useEffect(() => {
    Promise.allSettled([
      api.get('/v1/retailer/dashboard/stats'),
      api.get('/v1/retailer/orders?limit=10&sort=-createdAt'),
      api.get('/v1/retailer/alerts'),
    ]).then(([s, o, a]) => {
      if (s.status === 'fulfilled') setStats(s.value.data);
      if (o.status === 'fulfilled') setRecentOrders(o.value.data?.orders ?? o.value.data ?? []);
      if (a.status === 'fulfilled') setAlerts(a.value.data?.alerts ?? a.value.data ?? []);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1><p className="text-sm text-gray-500 mt-1">Your business at a glance</p></div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle size={16} className="text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-800">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Orders" value={stats.activeOrders} icon={ShoppingCart} color="blue" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="orange" />
        <StatCard title="Revenue (This Month)" value={`$${stats.monthRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Quality Score" value={`${stats.qualityScore}%`} icon={Star} color="indigo" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">View all <ArrowRight size={12} /></button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead>
          <tbody>
            {recentOrders.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No recent orders</td></tr> :
              recentOrders.map((o) => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">{o.productName}</td>
                  <td className="px-4 py-3 font-medium">${o.total?.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
