import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolder: z.string().min(2, 'Account holder name required'),
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(17, 'Account number too long'),
  routingNumber: z.string().length(9, 'Routing number must be 9 digits').regex(/^\d+$/, 'Must be digits only'),
});

type SetupForm = z.infer<typeof schema>;

/** Bank account setup form for retailer payouts with validation */
export default function PayoutSetup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SetupForm>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: SetupForm) {
    try {
      await api.post('/v1/retailer/finances/payout-setup', data);
      toast.success('Payout info saved');
    } catch {
      toast.error('Failed');
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payout Setup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
          <input {...register('bankName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
          <input {...register('accountHolder')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input {...register('accountNumber')} type="password" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
            <input {...register('routingNumber')} type="password" autoComplete="off" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            {errors.routingNumber && <p className="text-xs text-red-500 mt-1">{errors.routingNumber.message}</p>}
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
