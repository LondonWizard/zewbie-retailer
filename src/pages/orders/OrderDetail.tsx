import { useParams } from 'react-router-dom'

/** Order detail with accept, reject, and ship actions */
export default function OrderDetail() {
  const { id } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Order Detail</h1>
      <p className="text-gray-500 mb-4">Route: /orders/{id}</p>
      <p className="text-gray-600">
        Full order details with line items, customer info, and actions: accept, reject, mark as shipped.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
