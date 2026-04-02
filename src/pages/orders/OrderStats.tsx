import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import { Calendar, Download, ArrowLeftRight } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

/** Order statistics with date range picker, comparison period toggle, and chart export */
export default function OrderStats() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; orders: number }>>([]);
  const [statusData, setStatusData] = useState<Array<{ name: string; value: number }>>([]);
  const [dateRange, setDateRange] = useState('6m');
  const [showComparison, setShowComparison] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/v1/retailer/orders/stats?range=${dateRange}`).then((r) => {
      setMonthlyData(r.data?.monthly ?? []);
      setStatusData(r.data?.byStatus ?? []);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, [dateRange]);

  function exportChart() {
    if (!chartRef.current) return;
    const svgEl = chartRef.current.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'order-stats.svg'; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <PageSkeleton />;

  const totalOrders = monthlyData.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Statistics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Insights into your order performance</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <Calendar size={14} className="text-gray-400 ml-2" />
            {['1m', '3m', '6m', '1y'].map((r) => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${dateRange === r ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setShowComparison(!showComparison)} aria-label="Toggle comparison" className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${showComparison ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
            <ArrowLeftRight size={12} /> Compare
          </button>
          <button onClick={exportChart} aria-label="Export chart" className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total orders in period</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalOrders}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div ref={chartRef} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} /><YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }} /><Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }} /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
