import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, ShieldCheck, TrendingUp, Gem, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  website: z.string().optional(),
  productTypes: z.string().min(1, 'Describe your products'),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TRUST_POINTS = [
  { icon: ShieldCheck, text: 'Verified marketplace with buyer protection' },
  { icon: TrendingUp, text: 'Average 35% revenue growth in first 6 months' },
  { icon: Gem, text: 'Dedicated account manager for onboarding' },
];

/** Retailer application form with trust badges and validation */
export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  async function onSubmit(data: FormData) {
    try {
      await api.post('/v1/retailer/apply', data);
      setSubmitted(true);
    } catch {
      toast.error('Submission failed. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Application Submitted!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We'll review your application and get back to you within 2-3 business days.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trust Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Join Zewbie</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Apply to become a verified retailer on our marketplace.</p>
            <div className="space-y-4">
              {TRUST_POINTS.map((tp) => (
                <div key={tp.text} className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex-shrink-0">
                    <tp.icon size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tp.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name *</label>
                  <input {...register('businessName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name *</label>
                  <input {...register('contactName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website (optional)</label>
                <input {...register('website')} placeholder="https://yourstore.com" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Types *</label>
                <input {...register('productTypes')} placeholder="e.g. Rings, Necklaces, Custom Jewelry" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                {errors.productTypes && <p className="text-xs text-red-500 mt-1">{errors.productTypes.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Message</label>
                <textarea {...register('message')} rows={3} placeholder="Tell us about your business..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              </div>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
