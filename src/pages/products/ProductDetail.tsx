import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, ChevronRight, ImagePlus } from 'lucide-react';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({ name: z.string().min(1), sku: z.string().min(1), category: z.string().min(1), price: z.coerce.number().min(0), stock: z.coerce.number().int().min(0), description: z.string().optional(), status: z.string().optional() });
type FormData = z.infer<typeof schema>;

/** Product detail/edit page with breadcrumb, status badge, and image gallery */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productStatus, setProductStatus] = useState('draft');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  useEffect(() => {
    api.get(`/v1/retailer/products/${id}`).then((r) => {
      reset(r.data);
      setProductStatus(r.data?.status ?? 'draft');
    }).catch(() => toast.error('Not found')).finally(() => setLoading(false));
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    try { await api.put(`/v1/retailer/products/${id}`, data); toast.success('Product updated'); navigate('/products'); } catch { toast.error('Failed'); }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="p-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/products" className="hover:text-gray-700 dark:hover:text-gray-200">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 dark:text-gray-100">Edit</span>
      </nav>

      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
        <ArrowLeft size={14} /> Back to Products
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Product</h1>
        <StatusBadge status={productStatus} />
      </div>

      {/* Image Gallery Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Product Images</h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900/50">
          <ImagePlus size={24} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Upload product images to showcase your product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input {...register('name')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label><input {...register('sku')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><input {...register('category')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label><input type="number" step="0.01" {...register('price')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label><input type="number" {...register('stock')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"><Save size={16} /> {isSubmitting ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}
