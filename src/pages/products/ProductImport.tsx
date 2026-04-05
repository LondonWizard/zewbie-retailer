import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileSpreadsheet, ArrowLeft, CheckCircle, AlertCircle, Download } from 'lucide-react'
import api from '../../lib/api'
import useDocumentTitle from '../../hooks/useDocumentTitle'

interface PreviewRow {
  name: string
  sku: string
  price: string
  stock: string
  category: string
}

const SAMPLE_CSV = `name,sku,basePrice,stock,category
"Widget Pro",WGT-001,29.99,100,Electronics
"Gadget Mini",GDT-002,14.99,250,Electronics`

/** Bulk product import via CSV upload */
export default function ProductImport() {
  useDocumentTitle('Import Products')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PreviewRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  function handleFileSelect(selected: File | null) {
    if (!selected) return
    setFile(selected)
    setResult(null)
    setError('')
    parsePreview(selected)
  }

  async function parsePreview(csvFile: File) {
    try {
      const text = await csvFile.text()
      const lines = text.trim().split('\n')
      if (lines.length < 2) {
        setPreview([])
        return
      }
      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
      const rows = lines.slice(1, 6).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/"/g, ''))
        return {
          name: cols[headers.indexOf('name')] ?? '',
          sku: cols[headers.indexOf('sku')] ?? '',
          price: cols[headers.indexOf('basePrice')] ?? cols[headers.indexOf('price')] ?? '',
          stock: cols[headers.indexOf('stock')] ?? '',
          category: cols[headers.indexOf('category')] ?? '',
        }
      })
      setPreview(rows)
    } catch {
      setPreview([])
    }
  }

  async function handleImport() {
    if (!file) return
    try {
      setImporting(true)
      setError('')
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/retailers/me/products/import', formData)
      setResult(res.data ?? { success: 0, errors: 0 })
    } catch {
      setError('Import failed. Please check your CSV format and try again.')
    } finally {
      setImporting(false)
    }
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/products" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
          <CheckCircle size={16} />
          Import complete: {result.success} products created, {result.errors} errors.
        </div>
      )}

      {/* Upload area */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upload CSV</h2>
          <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <Download size={14} /> Download Template
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0] ?? null) }}
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <Upload size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your CSV file here, or
          </p>
          <label className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer">
            <FileSpreadsheet size={16} /> Choose File
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
          {file && (
            <p className="mt-3 text-sm text-gray-700">
              Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Column mapping preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview (first {preview.length} rows)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500">SKU</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-500">Price</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-500">Stock</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-500">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-gray-900">{row.name}</td>
                    <td className="px-4 py-2 text-gray-500 font-mono text-xs">{row.sku}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{row.price}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{row.stock}</td>
                    <td className="px-4 py-2 text-gray-700">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import button */}
      {file && (
        <button
          onClick={handleImport}
          disabled={importing}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <Upload size={16} /> {importing ? 'Importing...' : 'Start Import'}
        </button>
      )}
    </div>
  )
}
