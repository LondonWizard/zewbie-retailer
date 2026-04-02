import clsx from 'clsx';
const variants: Record<string, string> = {
  active: 'bg-green-100 text-green-700', approved: 'bg-green-100 text-green-700', completed: 'bg-green-100 text-green-700', shipped: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', manufacturing: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700', cancelled: 'bg-red-100 text-red-700', failed: 'bg-red-100 text-red-700',
  low: 'bg-orange-100 text-orange-700', draft: 'bg-gray-100 text-gray-600',
};
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(/[\s-]/g, '_');
  return <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', variants[key] ?? 'bg-gray-100 text-gray-700', className)}>{status.replace(/_/g, ' ')}</span>;
}
