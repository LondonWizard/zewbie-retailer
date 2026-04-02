import { useState, useMemo } from 'react'
import { Bell, ShoppingCart, CreditCard, AlertTriangle, Info, Check, X } from 'lucide-react'
import { create } from 'zustand'
import { useTranslation } from 'react-i18next'

type NotificationType = 'order' | 'payment' | 'system' | 'alert'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationState {
  notifications: Notification[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismiss: (id: string) => void
}

const typeIcons: Record<NotificationType, typeof Bell> = {
  order: ShoppingCart,
  payment: CreditCard,
  system: Info,
  alert: AlertTriangle,
}

const typeColors: Record<NotificationType, string> = {
  order: 'text-blue-500',
  payment: 'text-green-500',
  system: 'text-gray-500',
  alert: 'text-amber-500',
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      type: 'order',
      title: 'New order received',
      message: 'Order #1042 has been placed.',
      read: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment processed',
      message: 'Payout of $245.00 has been initiated.',
      read: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'system',
      title: 'Welcome to Zewbie',
      message: 'Get started by setting up your store.',
      read: true,
      createdAt: new Date(Date.now() - 86400000),
    },
  ],
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function groupByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {}
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  for (const n of notifications) {
    const ds = n.createdAt.toDateString()
    const label = ds === today ? 'Today' : ds === yesterday ? 'Yesterday' : ds
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  }
  return groups
}

/** Bell icon with unread badge + dropdown notification list */
export default function NotificationCenter() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { notifications, markAsRead, markAllAsRead, dismiss } = useNotificationStore()
  const unreadCount = notifications.filter((n) => !n.read).length
  const grouped = useMemo(() => groupByDate(notifications), [notifications])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('notifications.title', 'Notifications')}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                  <Check size={14} className="inline mr-1" />
                  {t('notifications.markAllRead', 'Mark all as read')}
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-400">
                  {t('notifications.empty', 'No notifications')}
                </p>
              ) : (
                Object.entries(grouped).map(([label, items]) => (
                  <div key={label}>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {label}
                    </p>
                    {items.map((n) => {
                      const Icon = typeIcons[n.type]
                      return (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                          }`}
                        >
                          <Icon size={16} className={`mt-0.5 flex-shrink-0 ${typeColors[n.type]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {n.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {formatRelative(n.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                            className="p-1 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
