import { Link } from 'react-router-dom'

/** Public landing / info page for the retailer portal */
export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-indigo-600">Zewbie Retailer</h1>
        <div className="flex gap-3">
          <Link to="/apply" className="text-sm text-indigo-600 hover:underline">
            Apply
          </Link>
          <Link
            to="/auth/login"
            className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700"
          >
            Login
          </Link>
        </div>
      </header>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Retailer Landing Page</h1>
        <p className="text-gray-500 mb-4">Route: /</p>
        <p className="text-gray-600">
          Public-facing information page for prospective retailers. Showcases benefits
          of selling on Zewbie and directs to the application form.
        </p>
        <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
        </div>
      </div>
    </div>
  )
}
