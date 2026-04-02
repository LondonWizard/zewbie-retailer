import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, TrendingUp, Globe, Star, Users, ArrowRight, Sparkles } from 'lucide-react';

const BENEFITS = [
  { icon: Gem, title: 'Premium Marketplace', desc: 'Reach thousands of engaged jewelry buyers seeking quality pieces.' },
  { icon: ShieldCheck, title: 'Secure Transactions', desc: 'Every order is protected with escrow and buyer/seller guarantees.' },
  { icon: TrendingUp, title: 'Growth Tools', desc: 'Analytics dashboard, inventory management, and marketing support.' },
  { icon: Globe, title: 'Global Reach', desc: 'Ship worldwide with integrated logistics and carrier partnerships.' },
];

const TRUST_STATS = [
  { value: '2,500+', label: 'Active Retailers' },
  { value: '$12M+', label: 'Monthly Sales' },
  { value: '99.5%', label: 'Uptime SLA' },
  { value: '4.9/5', label: 'Retailer Rating' },
];

/** Public landing page — showcases benefits and directs prospective retailers to apply */
export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Zewbie Retailer</h1>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/apply" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Apply
          </Link>
          <Link to="/auth/login" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-colors">
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-indigo-800 dark:via-indigo-900 dark:to-purple-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-40" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star size={14} className="text-yellow-300" />
            <span className="text-sm text-white/90">Trusted by 2,500+ jewelry retailers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-[fadeIn_0.6s_ease-out]">
            Grow Your Jewelry Business<br />with Zewbie
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Join the premier marketplace for independent jewelers. Get discovered by thousands of customers, manage your inventory effortlessly, and scale with confidence.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/apply" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
              Start Selling Today <ArrowRight size={16} />
            </Link>
            <Link to="/auth/login" className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Why Retailers Choose Zewbie</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Everything you need to succeed in online jewelry retail</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg w-fit mb-3">
                <b.icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{b.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <Users size={28} className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic max-w-2xl mx-auto mb-4">
            &ldquo;Zewbie transformed our small workshop into a thriving online business. The dashboard tools and customer reach are unmatched.&rdquo;
          </blockquote>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sarah Chen</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Founder, Lumina Fine Jewelry</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Ready to Get Started?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Join our community of successful jewelers today.</p>
        <Link to="/apply" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          Apply Now <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Zewbie. All rights reserved.</p>
      </footer>
    </div>
  );
}
