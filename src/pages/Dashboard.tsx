/** Retailer dashboard with key performance widgets */
export default function Dashboard() {
  const widgets = [
    'Pending Orders',
    'Revenue Summary',
    'Inventory Alerts',
    'Fulfillment Rate',
    'Notifications',
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-4">Route: /dashboard</p>
      <p className="text-gray-600">
        Overview of key metrics and alerts for the retailer.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div
            key={widget}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-700">{widget}</p>
            <div className="mt-3 h-16 border border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center">
              <span className="text-xs text-gray-400">—</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
