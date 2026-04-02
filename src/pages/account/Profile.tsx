import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Plus, Trash2, MapPin, UserCircle, KeyRound, Shield, Camera } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ProfileForm { businessName: string; contactName: string; email: string; phone: string; address: string; description: string; }
interface Warehouse { id: string; name: string; address: string; city: string; state: string; zip: string; }

/** Business profile with avatar upload, password change, 2FA status, and warehouse management */
export default function Profile() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capInput, setCapInput] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileForm>();

  useEffect(() => {
    api.get('/v1/retailer/profile').then((r) => {
      if (r.data?.profile) reset(r.data.profile);
      if (r.data?.warehouses) setWarehouses(r.data.warehouses);
      if (r.data?.capabilities) setCapabilities(r.data.capabilities);
      if (r.data?.twoFAEnabled) setTwoFAEnabled(r.data.twoFAEnabled);
    }).catch(() => {});
  }, [reset]);

  async function onSubmit(data: ProfileForm) {
    try { await api.put('/v1/retailer/profile', { profile: data, capabilities }); toast.success('Profile updated'); } catch { toast.error('Failed'); }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword) { toast.error('Fill in both fields'); return; }
    try {
      await api.post('/v1/retailer/profile/change-password', { currentPassword, newPassword });
      toast.success('Password changed');
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch { toast.error('Password change failed'); }
  }

  function addWarehouse() {
    setWarehouses([...warehouses, { id: `new_${Date.now()}`, name: '', address: '', city: '', state: '', zip: '' }]);
  }

  async function saveWarehouses() {
    try { await api.put('/v1/retailer/warehouses', { warehouses }); toast.success('Warehouses saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Business Profile</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your business information and account settings</p>

      {/* Avatar Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <UserCircle size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <label className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
            <Camera size={12} />
            <input type="file" accept="image/*" className="hidden" onChange={() => toast.info('Avatar upload coming soon')} />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Business Logo</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Upload a logo or avatar. Recommended: 200x200px, PNG or JPG.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label><input {...register('businessName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name</label><input {...register('contactName')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input {...register('email')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input {...register('phone')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label><input {...register('address')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea {...register('description')} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
        </section>

        {/* Capabilities */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                {c} <button type="button" onClick={() => setCapabilities(capabilities.filter((_, j) => j !== i))} className="hover:text-red-500">x</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (capInput.trim()) { setCapabilities([...capabilities, capInput.trim()]); setCapInput(''); } } }} placeholder="Add capability..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          </div>
        </section>

        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"><Save size={16} /> Save Profile</button>
      </form>

      {/* Password Change */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Password</h2>
          </div>
          {!changingPassword && (
            <button onClick={() => setChangingPassword(true)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Change Password</button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password.</p>
        {changingPassword && (
          <div className="space-y-3">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
            <div className="flex gap-2">
              <button onClick={changePassword} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Update Password</button>
              <button onClick={() => { setChangingPassword(false); setCurrentPassword(''); setNewPassword(''); }} className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">Cancel</button>
            </div>
          </div>
        )}
      </section>

      {/* 2FA Status */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Shield size={16} className="text-gray-500 dark:text-gray-400" /></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{twoFAEnabled ? 'Enabled — your account has extra security' : 'Not enabled — we recommend turning this on'}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${twoFAEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
            {twoFAEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </section>

      {/* Warehouses */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Warehouse Locations</h2>
          <button onClick={addWarehouse} className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"><Plus size={14} /> Add Warehouse</button>
        </div>
        {warehouses.map((w, i) => (
          <div key={w.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse {i + 1}</span></div>
              <button aria-label="Remove warehouse" onClick={() => setWarehouses(warehouses.filter((_, j) => j !== i))} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={w.name} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, name: e.target.value }; setWarehouses(n); }} placeholder="Name" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              <input value={w.address} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, address: e.target.value }; setWarehouses(n); }} placeholder="Address" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              <input value={w.city} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, city: e.target.value }; setWarehouses(n); }} placeholder="City" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              <div className="flex gap-2">
                <input value={w.state} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, state: e.target.value }; setWarehouses(n); }} placeholder="State" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex-1" />
                <input value={w.zip} onChange={(e) => { const n = [...warehouses]; n[i] = { ...w, zip: e.target.value }; setWarehouses(n); }} placeholder="ZIP" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-24" />
              </div>
            </div>
          </div>
        ))}
        {warehouses.length > 0 && <button onClick={saveWarehouses} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><Save size={14} /> Save Warehouses</button>}
      </section>
    </div>
  );
}
