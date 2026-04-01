import { Outlet, Link } from 'react-router-dom'

/** Step-wizard layout for retailer onboarding flow */
export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link to="/">
          <h1 className="text-lg font-bold text-indigo-600">Zewbie Retailer</h1>
        </Link>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
