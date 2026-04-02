import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import api from '../../lib/api';
import { toast } from 'sonner';

/** Revenue overview with date range picker, product breakdown, and export */
export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, monthRevenue: 0, avgOrderValue: 0 });
  const [chartData, setChartData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [productBreakdown, setProductBreakdown] = useState<Array<{ name: string; revenue: number; orders: number }>>([]);
  const [dateRange, setDateRange] = useState('6m');

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      api.get(`/v1/retailer/finances/revenue/stats?range=${dateRange}`),
      api.get(`/v1/retailer/finances/revenue/chart?range=${dateRange}`),
      api.get(`/v1/retailer/finances/revenue/breakdown?range=${dateRange}`),
    ]).then(([s, c, b]) => {
      if (s.status === 'fulfilled') setStats(s.value.data);
      if (c.status === 'fulfilled') setChartData(c.value.data ?? []);
      if (b.status === 'fulfilled') setProductBreakdown(b.value.data ?? []);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, [dateRange]);

  function exportCSV() {
    const header = 'Month,Revenue\n';
    const rows = chartData.map(d => `${d.month},${d.revenue}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'revenue-export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Revenue</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your earnings and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <Calendar size={14} className="text-gray-400 ml-2" />
            {['1m', '3m', '6m', '1y'].map((r) => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${dateRange === r ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} aria-label="Export revenue data" className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" trend="+15% vs prior period" trendUp={true} />
        <StatCard title="This Month" value={`$${stats.monthRevenue.toLocaleString()}`} icon={TrendingUp} color="indigo" />
        <StatCard title="Avg Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} icon={ShoppingCart} color="blue" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} /><YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenue by Product</h3>
        {productBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No product data available for this period.</p>
        ) : (
          <div className="space-y-3">
            {productBreakdown.map((p) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.orders} orders</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">${p.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
