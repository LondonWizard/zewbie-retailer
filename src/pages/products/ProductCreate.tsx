import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({ name: z.string().min(1), sku: z.string().min(1), category: z.string().min(1), price: z.coerce.number().min(0), stock: z.coerce.number().int().min(0), description: z.string().optional() });
type FormData = z.infer<typeof schema>;

export default function ProductCreate() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', sku: '', category: '', price: 0, stock: 0, description: '' } });

  async function onSubmit(data: FormData) {
    try { await api.post('/v1/retailer/products', data); toast.success('Product created'); navigate('/products'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU</label><input {...register('sku')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input {...register('category')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price</label><input type="number" step="0.01" {...register('price')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock</label><input type="number" {...register('stock')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"><Save size={16} /> Create Product</button>
      </form>
    </div>
  );
}
