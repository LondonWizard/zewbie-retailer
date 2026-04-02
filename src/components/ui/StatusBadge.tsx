import clsx from 'clsx';

const variants: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  manufacturing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  low: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  verified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

/** Status badge with dark mode support */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(/[\s-]/g, '_');
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', variants[key] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', className)}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
