import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Upload } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Product { id: string; name: string; sku: string; category: string; price: number; status: string; stock: number; }
const col = createColumnHelper<Product>();

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

  const columns = useMemo(() => [
    col.accessor('name', { header: 'Name', cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span> }),
    col.accessor('sku', { header: 'SKU', cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span> }),
    col.accessor('category', { header: 'Category' }),
    col.accessor('price', { header: 'Price', cell: (info) => `$${info.getValue()?.toFixed(2)}` }),
    col.accessor('stock', { header: 'Stock', cell: (info) => {
      const s = info.getValue();
      return <span className={s <= 5 ? 'text-red-600 font-medium' : ''}>{s}</span>;
    }}),
    col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
    col.display({ id: 'actions', header: '', cell: ({ row }) => <button onClick={() => navigate(`/products/${row.original.id}`)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Edit</button> }),
  ], [navigate]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/products/import')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"><Upload size={16} /> Import</button>
          <button onClick={() => navigate('/products/new')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Plus size={16} /> Add Product</button>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} isLoading={loading} searchKey="name" searchPlaceholder="Search products..."
        toolbar={<select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>}
      />
    </div>
  );
}
