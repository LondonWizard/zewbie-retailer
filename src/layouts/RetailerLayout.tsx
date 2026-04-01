import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Upload,
  Warehouse,
  ShoppingCart,
  BarChart3,
  DollarSign,
  TrendingUp,
  Truck,
  User,
  Settings,
  FlaskConical,
} from 'lucide-react'
import clsx from 'clsx'
import UserSection from '../components/UserSection'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'Products', to: '/products', icon: <Package size={18} /> },
      { label: 'Import', to: '/products/import', icon: <Upload size={18} /> },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { label: 'Inventory', to: '/inventory', icon: <Warehouse size={18} /> },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'Orders', to: '/orders', icon: <ShoppingCart size={18} /> },
      { label: 'Statistics', to: '/orders/stats', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    title: 'Finances',
    items: [
      { label: 'Payouts', to: '/finances/payouts', icon: <DollarSign size={18} /> },
      { label: 'Revenue', to: '/finances/revenue', icon: <TrendingUp size={18} /> },
    ],
  },
  {
    title: 'Shipping',
    items: [
      { label: 'Shipping Settings', to: '/shipping/settings', icon: <Truck size={18} /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', to: '/account/profile', icon: <User size={18} /> },
      { label: 'Settings', to: '/account/settings', icon: <Settings size={18} /> },
    ],
  },
  {
    title: '',
    items: [
      { label: 'API Tests', to: '/api-test', icon: <FlaskConical size={18} /> },
    ],
  },
]

/** Sidebar + main content area layout for authenticated retailer pages */
export default function RetailerLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-indigo-600">Zewbie Retailer</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <p className="px-2 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/products' || item.to === '/orders'}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        )
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200">
          <UserSection />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
