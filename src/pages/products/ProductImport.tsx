/** Bulk product import via CSV/spreadsheet upload */
export default function ProductImport() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Bulk Import Products</h1>
      <p className="text-gray-500 mb-4">Route: /products/import</p>
      <p className="text-gray-600">
        Upload a CSV or spreadsheet to bulk-create product listings.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
