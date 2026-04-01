import { useParams } from 'react-router-dom'

/** Product detail and edit view */
export default function ProductDetail() {
  const { id } = useParams()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Product Detail</h1>
      <p className="text-gray-500 mb-4">Route: /products/{id}</p>
      <p className="text-gray-600">
        View and edit product details, images, pricing, stock, and variants.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
