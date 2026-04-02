import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import api from '../../lib/api';
import { toast } from 'sonner';

export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, monthRevenue: 0, avgOrderValue: 0 });
  const [chartData, setChartData] = useState<Array<{ month: string; revenue: number }>>([]);

  useEffect(() => {
    Promise.allSettled([
      api.get('/v1/retailer/finances/revenue/stats'),
      api.get('/v1/retailer/finances/revenue/chart'),
    ]).then(([s, c]) => {
      if (s.status === 'fulfilled') setStats(s.value.data);
      if (c.status === 'fulfilled') setChartData(c.value.data ?? []);
    }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="This Month" value={`$${stats.monthRevenue.toLocaleString()}`} icon={TrendingUp} color="indigo" />
        <StatCard title="Avg Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} icon={ShoppingCart} color="blue" />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
