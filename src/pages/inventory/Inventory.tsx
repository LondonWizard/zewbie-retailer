import { useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { AlertTriangle } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface InventoryItem { id: string; productName: string; variantName: string; sku: string; stock: number; reserved: number; available: number; lowStockThreshold: number; }
const col = createColumnHelper<InventoryItem>();

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLowOnly, setShowLowOnly] = useState(false);

  useEffect(() => {
    api.get('/v1/retailer/inventory').then((r) => setItems(r.data?.items ?? r.data ?? [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => showLowOnly ? items.filter((i) => i.available <= i.lowStockThreshold) : items, [items, showLowOnly]);
  const lowCount = useMemo(() => items.filter((i) => i.available <= i.lowStockThreshold).length, [items]);

  const columns = useMemo(() => [
    col.accessor('productName', { header: 'Product', cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span> }),
    col.accessor('variantName', { header: 'Variant' }),
    col.accessor('sku', { header: 'SKU', cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span> }),
    col.accessor('stock', { header: 'Total Stock' }),
    col.accessor('reserved', { header: 'Reserved', cell: (info) => <span className="text-orange-600">{info.getValue()}</span> }),
    col.accessor('available', { header: 'Available', cell: (info) => {
      const val = info.getValue();
      const threshold = info.row.original.lowStockThreshold;
      return <span className={val <= threshold ? 'text-red-600 font-bold' : 'text-green-600 font-medium'}>{val}</span>;
    }}),
    col.display({ id: 'alert', header: '', cell: ({ row }) => {
      return row.original.available <= row.original.lowStockThreshold ? <StatusBadge status="low" /> : null;
    }}),
  ], []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track stock levels across products</p>
        </div>
        {lowCount > 0 && (
          <button onClick={() => setShowLowOnly(!showLowOnly)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${showLowOnly ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
            <AlertTriangle size={16} /> {lowCount} Low Stock Items
          </button>
        )}
      </div>
      <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="productName" searchPlaceholder="Search inventory..." />
    </div>
  );
}
