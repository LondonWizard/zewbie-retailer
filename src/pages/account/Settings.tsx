import { Save, Bell, Shield, Palette } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface SettingsState {
  emailNotifications: boolean;
  orderAlerts: boolean;
  weeklyReport: boolean;
  marketingEmails: boolean;
  darkMode: boolean;
  compactView: boolean;
}

const SECTIONS = [
  {
    title: 'Notifications',
    desc: 'Configure how and when you receive alerts and updates.',
    icon: Bell,
    items: [
      { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive email notifications for important events like order updates and payouts.' },
      { key: 'orderAlerts' as const, label: 'Order Alerts', desc: 'Get notified immediately when new orders come in or orders change status.' },
      { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly performance summary with revenue and order metrics.' },
      { key: 'marketingEmails' as const, label: 'Marketing Updates', desc: 'Receive tips, feature announcements, and marketplace insights.' },
    ],
  },
  {
    title: 'Appearance',
    desc: 'Customize how the dashboard looks and feels.',
    icon: Palette,
    items: [
      { key: 'darkMode' as const, label: 'Dark Mode', desc: 'Use dark theme for a comfortable viewing experience in low light.' },
      { key: 'compactView' as const, label: 'Compact View', desc: 'Reduce spacing and padding for denser information display.' },
    ],
  },
];

/** Account settings with grouped sections, descriptions, and animated toggles */
export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    orderAlerts: true,
    weeklyReport: false,
    marketingEmails: false,
    darkMode: false,
    compactView: false,
  });

  async function save() {
    try { await api.put('/v1/retailer/settings', settings); toast.success('Settings saved'); } catch { toast.error('Failed'); }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your notification preferences and display options</p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <section.icon size={18} className="text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{section.title}</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{section.desc}</p>

          {section.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="pr-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Switch.Root
                checked={settings[item.key]}
                onCheckedChange={(v) => setSettings({ ...settings, [item.key]: v })}
                className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full data-[state=checked]:bg-indigo-600 transition-colors flex-shrink-0"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          ))}
        </section>
      ))}

      {/* Security Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={18} className="text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Security</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security and access.</p>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Password and two-factor authentication settings are managed in your <a href="/account/profile" className="text-indigo-600 dark:text-indigo-400 hover:underline">Profile</a>.</p>
        </div>
      </section>

      <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"><Save size={16} /> Save Settings</button>
    </div>
  );
}
