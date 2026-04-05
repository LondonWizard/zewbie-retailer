import { Link } from 'react-router-dom'
import {
  Store,
  ShieldCheck,
  TrendingUp,
  Truck,
  ArrowRight,
  Package,
  BarChart3,
} from 'lucide-react'

const FEATURES = [
  { icon: Store, title: 'Your Own Storefront', description: 'Set up a branded store and reach thousands of Zewbie shoppers.' },
  { icon: Package, title: 'Easy Product Management', description: 'List products, manage variants, and update inventory in one place.' },
  { icon: Truck, title: 'Integrated Shipping', description: 'Connect carriers and automate label generation for faster fulfillment.' },
  { icon: BarChart3, title: 'Real-Time Analytics', description: 'Track orders, revenue, and performance with live dashboards.' },
  { icon: ShieldCheck, title: 'Secure Payments', description: 'Get paid reliably through Stripe with transparent commission rates.' },
  { icon: TrendingUp, title: 'Grow Your Business', description: 'Marketing tools and insights to help you scale on the platform.' },
]

/** Public landing page for the retailer portal */
export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-indigo-600">Zewbie Retailer</h1>
        <div className="flex items-center gap-3">
          <Link to="/apply" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Apply
          </Link>
          <Link
            to="/auth/login"
            className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 font-medium"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sell on Zewbie
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join a growing marketplace and reach new customers. Manage your products,
            orders, and finances — all from one powerful dashboard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Everything you need to sell online
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <feat.icon size={20} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">{feat.title}</h4>
              <p className="text-sm text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
          <p className="text-indigo-100 mb-6">
            Apply today and start selling on Zewbie in minutes.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Apply Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6">
        <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} Zewbie. All rights reserved.</p>
      </footer>
    </div>
  )
}
