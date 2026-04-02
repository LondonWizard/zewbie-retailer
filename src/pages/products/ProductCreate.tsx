import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, ImagePlus, X, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({ name: z.string().min(1, 'Name required'), sku: z.string().min(1, 'SKU required'), category: z.string().min(1, 'Category required'), price: z.coerce.number().min(0), stock: z.coerce.number().int().min(0), description: z.string().optional() });
type FormData = z.infer<typeof schema>;

const CREATE_STEPS = ['Details', 'Images', 'Review'];

/** Product creation form with image upload preview, step indicator, and auto-save draft */
export default function ProductCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any, defaultValues: { name: '', sku: '', category: '', price: 0, stock: 0, description: '' } });

  const formValues = watch();

  const handleImageAdd = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  function removeImage(idx: number) {
    setImages(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  }

  function saveDraft() {
    localStorage.setItem('product-draft', JSON.stringify(formValues));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
    toast.success('Draft saved');
  }

  async function onSubmit(data: FormData) {
    try {
      await api.post('/v1/retailer/products', data);
      localStorage.removeItem('product-draft');
      toast.success('Product created');
      navigate('/products');
    } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
        <ArrowLeft size={14} /> Back to Products
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Product</h1>
        <button onClick={saveDraft} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {draftSaved ? <><CheckCircle size={14} className="text-green-500" /> Saved</> : <><Save size={14} /> Save Draft</>}
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {CREATE_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => setStep(i)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${i === step ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : i < step ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
              {i < step ? <CheckCircle size={12} className="inline mr-1" /> : null}{s}
            </button>
            {i < CREATE_STEPS.length - 1 && <div className="w-6 h-0.5 bg-gray-200 dark:bg-gray-700" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input {...register('name')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label><input {...register('sku')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />{errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><input {...register('category')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />{errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label><input type="number" step="0.01" {...register('price')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label><input type="number" {...register('stock')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            <div className="flex justify-end"><button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next: Images</button></div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Product Images</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900/50">
              <ImagePlus size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Drag & drop images or click to browse</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Browse <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageAdd(e.target.files)} />
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={img.preview} alt={`Preview ${i + 1}`} className="w-full h-24 object-cover" />
                    <button type="button" aria-label="Remove image" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(0)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">Back</button>
              <button type="button" onClick={() => setStep(2)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next: Review</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Review</h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2 text-sm">
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> <span className="text-gray-600 dark:text-gray-400">{formValues.name || '—'}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">SKU:</span> <span className="text-gray-600 dark:text-gray-400">{formValues.sku || '—'}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Category:</span> <span className="text-gray-600 dark:text-gray-400">{formValues.category || '—'}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Price:</span> <span className="text-gray-600 dark:text-gray-400">${formValues.price}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Stock:</span> <span className="text-gray-600 dark:text-gray-400">{formValues.stock}</span></div>
              <div><span className="font-medium text-gray-700 dark:text-gray-300">Images:</span> <span className="text-gray-600 dark:text-gray-400">{images.length} uploaded</span></div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">Back</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"><Save size={16} /> {isSubmitting ? 'Creating...' : 'Create Product'}</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
