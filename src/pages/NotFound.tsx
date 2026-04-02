/** 404 page shown for unmatched routes */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-600 mt-2">Page not found</p>
        <a href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
