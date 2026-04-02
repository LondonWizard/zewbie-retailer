import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Building2, CreditCard, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import { toast } from 'sonner';

const schema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolder: z.string().min(2, 'Account holder name required'),
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(17, 'Account number too long'),
  routingNumber: z.string().length(9, 'Routing number must be 9 digits').regex(/^\d+$/, 'Must be digits only'),
});
type SetupForm = z.infer<typeof schema>;

const SETUP_STEPS = [
  { label: 'Bank Details', icon: Building2 },
  { label: 'Verification', icon: Shield },
  { label: 'Complete', icon: CheckCircle },
];

/** Bank account setup with step indicator, visibility toggles, and verification badge */
export default function PayoutSetup() {
  const [setupStep, setSetupStep] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const [showRouting, setShowRouting] = useState(false);
  const [verified, setVerified] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SetupForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: SetupForm) {
    try {
      await api.post('/v1/retailer/finances/payout-setup', data);
      toast.success('Payout info saved');
      setVerified(true);
      setSetupStep(2);
    } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payout Setup</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your bank account for receiving payments</p>
        </div>
        {verified && <StatusBadge status="verified" />}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {SETUP_STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${i <= setupStep ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
              <s.icon size={14} /> {s.label}
            </div>
            {i < SETUP_STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < setupStep ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {setupStep === 2 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Setup Complete!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your bank account is connected and verified for payouts.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={16} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bank Details</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
            <input {...register('bankName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
            {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Holder</label>
            <input {...register('accountHolder')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
            {errors.accountHolder && <p className="text-xs text-red-500 mt-1">{errors.accountHolder.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
              <div className="relative">
                <input {...register('accountNumber')} type={showAccount ? 'text' : 'password'} autoComplete="off" className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                <button type="button" aria-label="Toggle account number visibility" onClick={() => setShowAccount(!showAccount)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showAccount ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Routing Number</label>
              <div className="relative">
                <input {...register('routingNumber')} type={showRouting ? 'text' : 'password'} autoComplete="off" className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                <button type="button" aria-label="Toggle routing number visibility" onClick={() => setShowRouting(!showRouting)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showRouting ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.routingNumber && <p className="text-xs text-red-500 mt-1">{errors.routingNumber.message}</p>}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2"><Shield size={14} /> Your banking information is encrypted and stored securely.</p>
          </div>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save & Verify'}
          </button>
        </form>
      )}
    </div>
  );
}
