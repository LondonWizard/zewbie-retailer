import { useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { AlertTriangle, Download, Package, ArrowDownToLine } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface InventoryItem { id: string; productName: string; variantName: string; sku: string; stock: number; reserved: number; available: number; lowStockThreshold: number; }
const col = createColumnHelper<InventoryItem>();

/** Inventory management with color-coded stock levels, bulk update, low stock alerts, and export */
export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [bulkQty, setBulkQty] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.get('/v1/retailer/inventory').then((r) => setItems(r.data?.items ?? r.data ?? [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => showLowOnly ? items.filter((i) => i.available <= i.lowStockThreshold) : items, [items, showLowOnly]);
  const lowCount = useMemo(() => items.filter((i) => i.available <= i.lowStockThreshold).length, [items]);
  const totalStock = useMemo(() => items.reduce((s, i) => s + i.stock, 0), [items]);
  const totalAvailable = useMemo(() => items.reduce((s, i) => s + i.available, 0), [items]);

  function exportCSV() {
    const header = 'Product,Variant,SKU,Stock,Reserved,Available\n';
    const rows = items.map(i => `${i.productName},${i.variantName},${i.sku},${i.stock},${i.reserved},${i.available}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'inventory-export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  async function bulkUpdate() {
    if (!bulkQty || selectedIds.size === 0) return toast.error('Select items and enter quantity');
    try {
      await api.post('/v1/retailer/inventory/bulk-update', { ids: Array.from(selectedIds), stock: parseInt(bulkQty) });
      toast.success(`Updated ${selectedIds.size} items`);
      setSelectedIds(new Set());
      setBulkQty('');
    } catch { toast.error('Bulk update failed'); }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const columns = useMemo(() => [
    col.display({ id: 'select', header: '', cell: ({ row }) => (
      <input type="checkbox" checked={selectedIds.has(row.original.id)} onChange={() => toggleSelect(row.original.id)} className="rounded border-gray-300 dark:border-gray-600" />
    )}),
    col.accessor('productName', { header: 'Product', cell: (info) => <span className="font-medium text-gray-900 dark:text-gray-100">{info.getValue()}</span> }),
    col.accessor('variantName', { header: 'Variant', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('sku', { header: 'SKU', cell: (info) => <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{info.getValue()}</span> }),
    col.accessor('stock', { header: 'Total Stock', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('reserved', { header: 'Reserved', cell: (info) => <span className="text-orange-600 dark:text-orange-400">{info.getValue()}</span> }),
    col.accessor('available', { header: 'Available', cell: (info) => {
      const val = info.getValue();
      const threshold = info.row.original.lowStockThreshold;
      const color = val === 0 ? 'text-red-600 dark:text-red-400 font-bold' : val <= threshold ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 'text-green-600 dark:text-green-400 font-medium';
      return (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${val === 0 ? 'bg-red-500' : val <= threshold ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className={color}>{val}</span>
        </div>
      );
    }}),
    col.display({ id: 'alert', header: '', cell: ({ row }) => {
      return row.original.available <= row.original.lowStockThreshold ? <StatusBadge status="low" /> : null;
    }}),
  ], [selectedIds]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track stock levels across products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} aria-label="Export inventory CSV" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
            <Download size={16} /> Export
          </button>
          {lowCount > 0 && (
            <button onClick={() => setShowLowOnly(!showLowOnly)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showLowOnly ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'}`}>
              <AlertTriangle size={16} /> {lowCount} Low Stock
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Items" value={items.length} icon={Package} color="indigo" />
        <StatCard title="Total Stock" value={totalStock} icon={ArrowDownToLine} color="blue" />
        <StatCard title="Available" value={totalAvailable} icon={Package} color="green" />
      </div>

      {/* Bulk Update */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
          <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">{selectedIds.size} selected</span>
          <input type="number" value={bulkQty} onChange={(e) => setBulkQty(e.target.value)} placeholder="Set stock qty" className="px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded text-sm w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          <button onClick={bulkUpdate} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors">Update Stock</button>
        </div>
      )}

      <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="productName" searchPlaceholder="Search inventory..." />
    </div>
  );
}
