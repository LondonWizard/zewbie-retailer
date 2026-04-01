/** Orders list — incoming orders to fulfill */
export default function OrderList() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Orders</h1>
      <p className="text-gray-500 mb-4">Route: /orders</p>
      <p className="text-gray-600">
        View and manage incoming orders. Filter by status: pending, accepted, shipped, delivered.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
