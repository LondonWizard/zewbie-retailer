import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, FileText, Wrench, CheckCircle, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const businessSchema = z.object({ businessName: z.string().min(1), contactName: z.string().min(1), email: z.string().email(), phone: z.string().min(1), address: z.string().min(1), taxId: z.string().min(1) });
type BusinessForm = z.infer<typeof businessSchema>;

const STEPS = [
  { label: 'Business Info', icon: Building2, desc: 'Tell us about your company and contact details.' },
  { label: 'Documents', icon: FileText, desc: 'Upload your business license and certifications.' },
  { label: 'Capabilities', icon: Wrench, desc: 'Select the products you can manufacture or supply.' },
  { label: 'Review', icon: CheckCircle, desc: 'Review your application before submitting.' },
];

/** Multi-step retailer onboarding with progress bar, descriptions, and save indicator */
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessForm | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capInput, setCapInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BusinessForm>({ resolver: zodResolver(businessSchema) as any });

  function onBusinessSubmit(data: BusinessForm) {
    setBusinessData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setStep(1);
  }

  async function submitApplication() {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('business', JSON.stringify(businessData));
      fd.append('capabilities', JSON.stringify(capabilities));
      documents.forEach((d) => fd.append('documents', d));
      await api.post('/v1/retailer/onboarding/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted! We will review it shortly.');
      navigate('/dashboard');
    } catch { toast.error('Submission failed'); }
    setSubmitting(false);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Retailer Onboarding</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Complete these steps to start selling on Zewbie</p>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-4">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${i <= step ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                <s.icon size={14} /> {s.label}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-1 transition-colors ${i < step ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step description */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">{STEPS[step].desc}</p>

        {/* Save indicator */}
        {saved && (
          <div className="flex items-center justify-center gap-2 mb-4 text-green-600 dark:text-green-400 text-sm animate-pulse">
            <Save size={14} /> Progress saved
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          {step === 0 && (
            <form onSubmit={handleSubmit(onBusinessSubmit)} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Business Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label><input {...register('businessName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />{errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name</label><input {...register('contactName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input {...register('email')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label><input {...register('address')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax ID</label><input {...register('taxId')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
              <div className="flex justify-end"><button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next <ArrowRight size={14} /></button></div>
            </form>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Upload Documents</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload your business license, insurance, and any relevant certifications.</p>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-900/50">
                <FileText size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Choose Files
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    const MAX_SIZE = 10 * 1024 * 1024;
                    const ALLOWED = ['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    const invalid = files.filter(f => f.size > MAX_SIZE || !ALLOWED.includes(f.type));
                    if (invalid.length) { alert(`Some files rejected: ${invalid.map(f => f.name).join(', ')}. Max 10MB, allowed: PDF, JPG, PNG, DOC, DOCX.`); return; }
                    setDocuments(files);
                    setSaved(true); setTimeout(() => setSaved(false), 2000);
                  }} />
                </label>
              </div>
              {documents.length > 0 && <div className="space-y-1">{documents.map((d, i) => <p key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><FileText size={14} /> {d.name}</p>)}</div>}
              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next <ArrowRight size={14} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Set Capabilities</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">What types of products can you manufacture/supply?</p>
              <div className="flex flex-wrap gap-2">
                {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Loose Diamonds', 'Custom Jewelry', 'Watches'].map((c) => (
                  <button key={c} type="button" onClick={() => setCapabilities(capabilities.includes(c) ? capabilities.filter((x) => x !== c) : [...capabilities, c])} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${capabilities.includes(c) ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (capInput.trim() && !capabilities.includes(capInput.trim())) { setCapabilities([...capabilities, capInput.trim()]); setCapInput(''); } } }} placeholder="Add custom capability..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Next <ArrowRight size={14} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Review & Submit</h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3 text-sm">
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Business:</span> <span className="text-gray-600 dark:text-gray-400">{businessData?.businessName}</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span> <span className="text-gray-600 dark:text-gray-400">{businessData?.contactName} ({businessData?.email})</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Documents:</span> <span className="text-gray-600 dark:text-gray-400">{documents.length} file(s) uploaded</span></div>
                <div><span className="font-medium text-gray-700 dark:text-gray-300">Capabilities:</span> <span className="text-gray-600 dark:text-gray-400">{capabilities.join(', ') || 'None'}</span></div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={submitApplication} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                  <CheckCircle size={16} /> {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
