/** Create a new product listing with details, images, pricing, and variants */
export default function ProductCreate() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Create Product</h1>
      <p className="text-gray-500 mb-4">Route: /products/new</p>
      <p className="text-gray-600">
        Form to create a new product listing with details, images, pricing, and variant options.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
