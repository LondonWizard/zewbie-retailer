import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ParsedRow { row: number; name: string; sku: string; category: string; price: number; stock: number; error?: string; }

export default function ProductImport() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      const rows: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const row: ParsedRow = { row: i, name: cols[0] ?? '', sku: cols[1] ?? '', category: cols[2] ?? '', price: parseFloat(cols[3]) || 0, stock: parseInt(cols[4]) || 0 };
        if (!row.name) row.error = 'Name is required';
        else if (!row.sku) row.error = 'SKU is required';
        rows.push(row);
      }
      setParsed(rows);
    };
    reader.readAsText(f);
  }, []);

  async function confirmImport() {
    const valid = parsed.filter((r) => !r.error);
    if (valid.length === 0) return toast.error('No valid rows to import');
    setImporting(true);
    try {
      await api.post('/v1/retailer/products/import', { products: valid });
      toast.success(`${valid.length} products imported`);
      navigate('/products');
    } catch { toast.error('Import failed'); }
    setImporting(false);
  }

  const errors = parsed.filter((r) => r.error);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
      <p className="text-sm text-gray-500">Upload a CSV file with columns: Name, SKU, Category, Price, Stock</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <FileSpreadsheet size={40} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 mb-2">{file ? file.name : 'Drag & drop your CSV/Excel file here'}</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
          <Upload size={16} /> Browse Files
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
      </div>

      {parsed.length > 0 && (
        <>
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><AlertCircle size={16} className="text-red-600" /><p className="text-sm font-medium text-red-800">{errors.length} row(s) have errors</p></div>
              <ul className="text-xs text-red-600 space-y-1">{errors.map((r) => <li key={r.row}>Row {r.row}: {r.error}</li>)}</ul>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Row</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th></tr></thead>
              <tbody>
                {parsed.map((r) => (
                  <tr key={r.row} className={`border-b ${r.error ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-2">{r.row}</td><td className="px-4 py-2">{r.name}</td><td className="px-4 py-2 font-mono text-xs">{r.sku}</td><td className="px-4 py-2">{r.category}</td><td className="px-4 py-2">${r.price.toFixed(2)}</td><td className="px-4 py-2">{r.stock}</td>
                    <td className="px-4 py-2">{r.error ? <span className="text-red-600 text-xs">{r.error}</span> : <CheckCircle size={14} className="text-green-500" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={confirmImport} disabled={importing || errors.length === parsed.length} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {importing ? 'Importing...' : `Import ${parsed.length - errors.length} Products`}
          </button>
        </>
      )}
    </div>
  );
}
