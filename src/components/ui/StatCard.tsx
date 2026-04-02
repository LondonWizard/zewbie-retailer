import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
const colorMap = { indigo: 'bg-indigo-50 text-indigo-600', green: 'bg-green-50 text-green-600', orange: 'bg-orange-50 text-orange-600', red: 'bg-red-50 text-red-600', blue: 'bg-blue-50 text-blue-600' };
interface Props { title: string; value: string | number; icon: LucideIcon; color?: keyof typeof colorMap; trend?: string; trendUp?: boolean; }
export function StatCard({ title, value, icon: Icon, color = 'indigo', trend, trendUp }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-500">{title}</p><div className={clsx('p-2 rounded-lg', colorMap[color])}><Icon size={18} /></div></div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {trend && <p className={clsx('mt-1 text-xs font-medium', trendUp ? 'text-green-600' : 'text-red-600')}>{trend}</p>}
    </div>
  );
}
