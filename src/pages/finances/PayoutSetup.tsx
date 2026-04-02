import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface SetupForm { bankName: string; accountNumber: string; routingNumber: string; accountHolder: string; }

export default function PayoutSetup() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SetupForm>();

  async function onSubmit(data: SetupForm) {
    try { await api.post('/v1/retailer/finances/payout-setup', data); toast.success('Payout info saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payout Setup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input {...register('bankName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label><input {...register('accountHolder')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label><input {...register('accountNumber')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label><input {...register('routingNumber')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"><Save size={16} /> Save</button>
      </form>
    </div>
  );
}
