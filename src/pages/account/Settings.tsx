import { Save } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';


export default function Settings() {
  const [settings, setSettings] = useState({ emailNotifications: true, orderAlerts: true, weeklyReport: false });

  async function save() {
    try { await api.put('/v1/retailer/settings', settings); toast.success('Settings saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        {[
          { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive email notifications for important events' },
          { key: 'orderAlerts' as const, label: 'Order Alerts', desc: 'Get notified when new orders come in' },
          { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly performance summary' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium text-gray-700">{item.label}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
            <Switch.Root checked={settings[item.key]} onCheckedChange={(v) => setSettings({ ...settings, [item.key]: v })} className="w-10 h-5 bg-gray-300 rounded-full data-[state=checked]:bg-indigo-600 transition-colors">
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        ))}
      </section>

      <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><Save size={16} /> Save Settings</button>
    </div>
  );
}
