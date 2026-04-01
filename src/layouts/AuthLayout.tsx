import { Outlet, Link } from 'react-router-dom'

/** Centered layout for authentication pages (login, register, etc.) */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">Zewbie Retailer</h1>
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <Outlet />
      </div>
    </div>
  )
}
