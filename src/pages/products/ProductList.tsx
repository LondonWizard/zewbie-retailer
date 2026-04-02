import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Upload, Package, CheckCircle, FileEdit } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Product { id: string; name: string; sku: string; category: string; price: number; status: string; stock: number; }
const col = createColumnHelper<Product>();

/** Product listing with stat cards, category filter, and empty state */
export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    api.get('/v1/retailer/products').then((r) => setProducts(r.data?.products ?? r.data ?? [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => categoryFilter === 'all' ? products : products.filter((p) => p.category === categoryFilter), [products, categoryFilter]);
  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const totalCount = products.length;
  const activeCount = products.filter(p => p.status === 'active').length;
  const draftCount = products.filter(p => p.status === 'draft').length;

  const columns = useMemo(() => [
    col.accessor('name', { header: 'Name', cell: (info) => <span className="font-medium text-gray-900 dark:text-gray-100">{info.getValue()}</span> }),
    col.accessor('sku', { header: 'SKU', cell: (info) => <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{info.getValue()}</span> }),
    col.accessor('category', { header: 'Category', cell: (info) => <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span> }),
    col.accessor('price', { header: 'Price', cell: (info) => <span className="text-gray-900 dark:text-gray-100">${info.getValue()?.toFixed(2)}</span> }),
    col.accessor('stock', { header: 'Stock', cell: (info) => {
      const s = info.getValue();
      return <span className={s <= 5 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300'}>{s}</span>;
    }}),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.display({ id: 'actions', header: '', cell: ({ row }) => <button onClick={() => navigate(`/products/${row.original.id}`)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">Edit</button> }),
  ], [navigate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/products/import')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"><Upload size={16} /> Import</button>
          <button onClick={() => navigate('/products/new')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"><Plus size={16} /> Add Product</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Products" value={totalCount} icon={Package} color="indigo" />
        <StatCard title="Active" value={activeCount} icon={CheckCircle} color="green" />
        <StatCard title="Drafts" value={draftCount} icon={FileEdit} color="orange" />
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No products yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Start by adding your first product or importing a CSV file.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/products/new')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"><Plus size={16} /> Add Product</button>
            <button onClick={() => navigate('/products/import')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"><Upload size={16} /> Import CSV</button>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="name" searchPlaceholder="Search products..."
          toolbar={<select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"><option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>}
        />
      )}
    </div>
  );
}
