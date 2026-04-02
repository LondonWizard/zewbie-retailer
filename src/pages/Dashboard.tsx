import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, DollarSign, Star, AlertTriangle, ArrowRight, Plus, Eye, Wallet, Activity } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageSkeleton } from '../components/ui/PageSkeleton';
import api from '../lib/api';

interface DashStats { activeOrders: number; pendingOrders: number; monthRevenue: number; qualityScore: number; }

/** Main retailer dashboard with welcome message, stat cards with trends, quick actions, and recent activity */
export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashStats>({ activeOrders: 0, pendingOrders: 0, monthRevenue: 0, qualityScore: 0 });
  const [recentOrders, setRecentOrders] = useState<Array<{ id: string; productName: string; total: number; status: string; createdAt: string }>>([]);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string }>>([]);
  const [error, setError] = useState(false);

  function load() {
    setError(false); setLoading(true);
    Promise.allSettled([
      api.get('/v1/retailer/dashboard/stats'),
      api.get('/v1/retailer/orders?limit=10&sort=-createdAt'),
      api.get('/v1/retailer/alerts'),
    ]).then(([s, o, a]) => {
      const allFailed = [s, o, a].every(r => r.status === 'rejected');
      if (allFailed) { setError(true); return; }
      if (s.status === 'fulfilled') setStats(s.value.data);
      if (o.status === 'fulfilled') setRecentOrders(o.value.data?.orders ?? o.value.data ?? []);
      if (a.status === 'fulfilled') setAlerts(a.value.data?.alerts ?? a.value.data ?? []);
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to load</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Could not fetch dashboard data.</p>
          <button onClick={load} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'Add Product', icon: Plus, path: '/products/new', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'View Orders', icon: Eye, path: '/orders', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Check Payouts', icon: Wallet, path: '/finances/payouts', color: 'bg-green-600 hover:bg-green-700' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <AlertTriangle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <p className="text-sm text-orange-800 dark:text-orange-300">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards with trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Orders" value={stats.activeOrders} icon={ShoppingCart} color="blue" trend="+12% vs last month" trendUp={true} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="orange" trend={stats.pendingOrders > 0 ? 'Needs attention' : 'All clear'} trendUp={stats.pendingOrders === 0} />
        <StatCard title="Revenue (This Month)" value={`$${stats.monthRevenue.toLocaleString()}`} icon={DollarSign} color="green" trend="+8% vs last month" trendUp={true} />
        <StatCard title="Quality Score" value={`${stats.qualityScore}%`} icon={Star} color="indigo" trend={stats.qualityScore >= 90 ? 'Excellent' : 'Needs improvement'} trendUp={stats.qualityScore >= 90} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors ${a.color}`}>
              <a.icon size={16} /> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Activity size={14} /> Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1">View all <ArrowRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order ID</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th></tr></thead>
            <tbody>
              {recentOrders.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">No recent orders</td></tr> :
                recentOrders.map((o) => (
                  <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">{o.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{o.productName}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">${o.total?.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
