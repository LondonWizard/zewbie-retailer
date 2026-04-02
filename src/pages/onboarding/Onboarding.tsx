import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, FileText, Wrench, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

const businessSchema = z.object({ businessName: z.string().min(1), contactName: z.string().min(1), email: z.string().email(), phone: z.string().min(1), address: z.string().min(1), taxId: z.string().min(1) });
type BusinessForm = z.infer<typeof businessSchema>;

const STEPS = [
  { label: 'Business Info', icon: Building2 },
  { label: 'Documents', icon: FileText },
  { label: 'Capabilities', icon: Wrench },
  { label: 'Review', icon: CheckCircle },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessForm | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capInput, setCapInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BusinessForm>({ resolver: zodResolver(businessSchema) as any });

  function onBusinessSubmit(data: BusinessForm) { setBusinessData(data); setStep(1); }

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Retailer Onboarding</h1>
          <p className="text-sm text-gray-500 mt-2">Complete these steps to start selling on Zewbie</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${i <= step ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
                <s.icon size={14} /> {s.label}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-1 ${i < step ? 'bg-indigo-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {step === 0 && (
            <form onSubmit={handleSubmit(onBusinessSubmit)} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input {...register('businessName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />{errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label><input {...register('contactName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input {...register('address')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label><input {...register('taxId')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
              <div className="flex justify-end"><button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Next <ArrowRight size={14} /></button></div>
            </form>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
              <p className="text-sm text-gray-500">Upload your business license, insurance, and any relevant certifications.</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
                  Choose Files
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    const MAX_SIZE = 10 * 1024 * 1024;
                    const ALLOWED = ['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    const invalid = files.filter(f => f.size > MAX_SIZE || !ALLOWED.includes(f.type));
                    if (invalid.length) { alert(`Some files rejected: ${invalid.map(f => f.name).join(', ')}. Max 10MB, allowed: PDF, JPG, PNG, DOC, DOCX.`); return; }
                    setDocuments(files);
                  }} />
                </label>
              </div>
              {documents.length > 0 && <div className="space-y-1">{documents.map((d, i) => <p key={i} className="text-sm text-gray-600 flex items-center gap-2"><FileText size={14} /> {d.name}</p>)}</div>}
              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Next <ArrowRight size={14} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Set Capabilities</h2>
              <p className="text-sm text-gray-500">What types of products can you manufacture/supply?</p>
              <div className="flex flex-wrap gap-2">
                {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Loose Diamonds', 'Custom Jewelry', 'Watches'].map((c) => (
                  <button key={c} type="button" onClick={() => setCapabilities(capabilities.includes(c) ? capabilities.filter((x) => x !== c) : [...capabilities, c])} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${capabilities.includes(c) ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (capInput.trim() && !capabilities.includes(capInput.trim())) { setCapabilities([...capabilities, capInput.trim()]); setCapInput(''); } } }} placeholder="Add custom capability..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Next <ArrowRight size={14} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Submit</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div><span className="font-medium text-gray-700">Business:</span> <span className="text-gray-600">{businessData?.businessName}</span></div>
                <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-600">{businessData?.contactName} ({businessData?.email})</span></div>
                <div><span className="font-medium text-gray-700">Documents:</span> <span className="text-gray-600">{documents.length} file(s) uploaded</span></div>
                <div><span className="font-medium text-gray-700">Capabilities:</span> <span className="text-gray-600">{capabilities.join(', ') || 'None'}</span></div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"><ArrowLeft size={14} /> Back</button>
                <button onClick={submitApplication} disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
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
