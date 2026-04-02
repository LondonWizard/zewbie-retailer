import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Truck, Plus, Trash2, MapPin, Calculator } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ShippingForm { defaultSlaHours: number; preferredCarrier: string; freeShippingThreshold: number; }
interface ShippingZone { id: string; name: string; regions: string; rate: number; }

/** Shipping settings with zone management, carrier selection, and delivery calculator */
export default function ShippingSettings() {
  const [carriers, setCarriers] = useState([
    { name: 'UPS', enabled: true }, { name: 'FedEx', enabled: true }, { name: 'USPS', enabled: false }, { name: 'DHL', enabled: false },
  ]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [calcWeight, setCalcWeight] = useState('');
  const [calcZone, setCalcZone] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ShippingForm>({ defaultValues: { defaultSlaHours: 72, preferredCarrier: 'UPS', freeShippingThreshold: 100 } });

  useEffect(() => {
    api.get('/v1/retailer/shipping/settings').then((r) => {
      if (r.data?.settings) reset(r.data.settings);
      if (r.data?.carriers) setCarriers(r.data.carriers);
      if (r.data?.zones) setZones(r.data.zones);
    }).catch(() => {});
  }, [reset]);

  async function onSubmit(data: ShippingForm) {
    try { await api.put('/v1/retailer/shipping/settings', { settings: data, carriers, zones }); toast.success('Shipping settings saved'); } catch { toast.error('Failed'); }
  }

  function addZone() {
    setZones([...zones, { id: `zone_${Date.now()}`, name: '', regions: '', rate: 0 }]);
  }

  function calculateDelivery() {
    if (!calcWeight || !calcZone) { toast.error('Enter weight and zone'); return; }
    const zone = zones.find(z => z.name === calcZone);
    const weight = parseFloat(calcWeight);
    const baseCost = zone ? zone.rate : 9.99;
    const est = (baseCost + weight * 0.5).toFixed(2);
    const days = calcZone.toLowerCase().includes('international') ? '7-14 days' : '3-5 days';
    setCalcResult(`Estimated: $${est} | Delivery: ${days}`);
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipping Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your shipping preferences, carriers, and zones</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Default Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Default Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your default shipping parameters.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default SLA (hours)</label><input type="number" {...register('defaultSlaHours')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Carrier</label>
              <select {...register('preferredCarrier')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <option value="UPS">UPS</option><option value="FedEx">FedEx</option><option value="USPS">USPS</option><option value="DHL">DHL</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Free Shipping Threshold ($)</label><input type="number" step="0.01" {...register('freeShippingThreshold')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" /></div>
          </div>
        </section>

        {/* Carrier Preferences */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Carrier Preferences</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable shipping carriers for your store.</p>
          {carriers.map((carrier, i) => (
            <div key={carrier.name} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Truck size={16} className="text-gray-500 dark:text-gray-400" /></div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{carrier.name}</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{carrier.enabled ? 'Available for orders' : 'Disabled'}</p>
                </div>
              </div>
              <Switch.Root checked={carrier.enabled} onCheckedChange={(v) => { const next = [...carriers]; next[i] = { ...carrier, enabled: v }; setCarriers(next); }} className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full data-[state=checked]:bg-indigo-600 transition-colors">
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          ))}
        </section>

        {/* Shipping Zones */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipping Zones</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define regions and flat-rate pricing for each zone.</p>
            </div>
            <button type="button" onClick={addZone} className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"><Plus size={14} /> Add Zone</button>
          </div>
          {zones.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <MapPin size={24} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              No zones configured. Click "Add Zone" to start.
            </div>
          ) : zones.map((z, i) => (
            <div key={z.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> Zone {i + 1}</span>
                <button type="button" aria-label="Remove zone" onClick={() => setZones(zones.filter((_, j) => j !== i))} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={z.name} onChange={(e) => { const n = [...zones]; n[i] = { ...z, name: e.target.value }; setZones(n); }} placeholder="Zone name" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                <input value={z.regions} onChange={(e) => { const n = [...zones]; n[i] = { ...z, regions: e.target.value }; setZones(n); }} placeholder="Regions (e.g. US, CA)" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
                <input type="number" step="0.01" value={z.rate} onChange={(e) => { const n = [...zones]; n[i] = { ...z, rate: parseFloat(e.target.value) || 0 }; setZones(n); }} placeholder="Flat rate ($)" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              </div>
            </div>
          ))}
        </section>

        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"><Save size={16} /> Save Settings</button>
      </form>

      {/* Delivery Calculator Preview */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Delivery Estimator</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Preview shipping cost and delivery time estimates.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} placeholder="Weight (lbs)" className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
          <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <option value="">Select zone</option>
            {zones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
            <option value="Domestic">Domestic (default)</option>
            <option value="International">International (default)</option>
          </select>
          <button type="button" onClick={calculateDelivery} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Calculate</button>
        </div>
        {calcResult && <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">{calcResult}</p>}
      </section>
    </div>
  );
}
