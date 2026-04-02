import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
};

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: keyof typeof colorMap;
  trend?: string;
  trendUp?: boolean;
}

/** Stat card with optional trend indicator arrow */
export function StatCard({ title, value, icon: Icon, color = 'indigo', trend, trendUp }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={clsx('p-2 rounded-lg', colorMap[color])}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {trend && (
        <p className={clsx('mt-1 text-xs font-medium flex items-center gap-1', trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </p>
      )}
    </div>
  );
}
