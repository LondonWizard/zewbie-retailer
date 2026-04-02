import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, MapPin } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ProfileForm { businessName: string; contactName: string; email: string; phone: string; address: string; description: string; }
interface Warehouse { id: string; name: string; address: string; city: string; state: string; zip: string; }

export default function Profile() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capInput, setCapInput] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileForm>();

  useEffect(() => {
    api.get('/v1/retailer/profile').then((r) => {
      if (r.data?.profile) reset(r.data.profile);
      if (r.data?.warehouses) setWarehouses(r.data.warehouses);
      if (r.data?.capabilities) setCapabilities(r.data.capabilities);
    }).catch(() => {});
  }, [reset]);

  async function onSubmit(data: ProfileForm) {
    try { await api.put('/v1/retailer/profile', { profile: data, capabilities }); toast.success('Profile updated'); } catch { toast.error('Failed'); }
  }

  function addWarehouse() {
    setWarehouses([...warehouses, { id: `new_${Date.now()}`, name: '', address: '', city: '', state: '', zip: '' }]);
  }

  async function saveWarehouses() {
    try { await api.put('/v1/retailer/warehouses', { warehouses }); toast.success('Warehouses saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Business Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input {...register('businessName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label><input {...register('contactName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input {...register('email')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input {...register('address')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                {c} <button type="button" onClick={() => setCapabilities(capabilities.filter((_, j) => j !== i))} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (capInput.trim()) { setCapabilities([...capabilities, capInput.trim()]); setCapInput(''); } } }} placeholder="Add capability..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </section>

        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"><Save size={16} /> Save Profile</button>
      </form>

      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Warehouse Locations</h2>
          <button onClick={addWarehouse} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"><Plus size={14} /> Add Warehouse</button>
        </div>
        {warehouses.map((w, i) => (
          <div key={w.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /><span className="text-sm font-medium">Warehouse {i + 1}</span></div>
              <button onClick={() => setWarehouses(warehouses.filter((_, j) => j !== i))} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={w.name} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, name: e.target.value }; setWarehouses(n); }} placeholder="Name" className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
              <input value={w.address} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, address: e.target.value }; setWarehouses(n); }} placeholder="Address" className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
              <input value={w.city} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, city: e.target.value }; setWarehouses(n); }} placeholder="City" className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
              <div className="flex gap-2">
                <input value={w.state} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, state: e.target.value }; setWarehouses(n); }} placeholder="State" className="px-2 py-1.5 border border-gray-300 rounded text-sm flex-1" />
                <input value={w.zip} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, zip: e.target.value }; setWarehouses(n); }} placeholder="ZIP" className="px-2 py-1.5 border border-gray-300 rounded text-sm w-24" />
              </div>
            </div>
          </div>
        ))}
        {warehouses.length > 0 && <button onClick={saveWarehouses} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"><Save size={14} /> Save Warehouses</button>}
      </section>
    </div>
  );
}
