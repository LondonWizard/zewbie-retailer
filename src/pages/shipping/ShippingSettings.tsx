import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Truck } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ShippingForm { defaultSlaHours: number; preferredCarrier: string; freeShippingThreshold: number; }

export default function ShippingSettings() {
  const [carriers, setCarriers] = useState([
    { name: 'UPS', enabled: true }, { name: 'FedEx', enabled: true }, { name: 'USPS', enabled: false }, { name: 'DHL', enabled: false },
  ]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ShippingForm>({ defaultValues: { defaultSlaHours: 72, preferredCarrier: 'UPS', freeShippingThreshold: 100 } });

  useEffect(() => {
    api.get('/v1/retailer/shipping/settings').then((r) => {
      if (r.data?.settings) reset(r.data.settings);
      if (r.data?.carriers) setCarriers(r.data.carriers);
    }).catch(() => {});
  }, [reset]);

  async function onSubmit(data: ShippingForm) {
    try { await api.put('/v1/retailer/shipping/settings', { settings: data, carriers }); toast.success('Shipping settings saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-gray-900">Shipping Settings</h1><p className="text-sm text-gray-500 mt-1">Configure your shipping preferences and carriers</p></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Default Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Default SLA (hours)</label><input type="number" {...register('defaultSlaHours')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Preferred Carrier</label>
              <select {...register('preferredCarrier')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="UPS">UPS</option><option value="FedEx">FedEx</option><option value="USPS">USPS</option><option value="DHL">DHL</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label><input type="number" step="0.01" {...register('freeShippingThreshold')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Carrier Preferences</h2>
          {carriers.map((carrier, i) => (
            <div key={carrier.name} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2"><Truck size={16} className="text-gray-400" /><span className="text-sm font-medium text-gray-700">{carrier.name}</span></div>
              <Switch.Root checked={carrier.enabled} onCheckedChange={(v) => { const next = [...carriers]; next[i] = { ...carrier, enabled: v }; setCarriers(next); }} className="w-10 h-5 bg-gray-300 rounded-full data-[state=checked]:bg-indigo-600 transition-colors">
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          ))}
        </section>

        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"><Save size={16} /> Save Settings</button>
      </form>
    </div>
  );
}
