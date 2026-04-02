import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface ParsedRow { row: number; name: string; sku: string; category: string; price: number; stock: number; error?: string; }

/** CSV product import with template download, progress bar, and validation summary */
export default function ProductImport() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
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

  function downloadTemplate() {
    const csv = 'Name,SKU,Category,Price,Stock\nExample Ring,RING-001,Rings,299.99,10\nExample Necklace,NECK-001,Necklaces,499.99,5';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'product-import-template.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  async function confirmImport() {
    const valid = parsed.filter((r) => !r.error);
    if (valid.length === 0) return toast.error('No valid rows to import');
    setImporting(true);
    setImportProgress(0);
    const interval = setInterval(() => setImportProgress(p => Math.min(p + 10, 90)), 300);
    try {
      await api.post('/v1/retailer/products/import', { products: valid });
      setImportProgress(100);
      toast.success(`${valid.length} products imported`);
      setTimeout(() => navigate('/products'), 1000);
    } catch { toast.error('Import failed'); }
    clearInterval(interval);
    setImporting(false);
  }

  const errors = parsed.filter((r) => r.error);
  const validCount = parsed.length - errors.length;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
        <ArrowLeft size={14} /> Back to Products
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Import Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a CSV file with columns: Name, SKU, Category, Price, Stock</p>
        </div>
        <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
          <Download size={16} /> Download Template
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragOver ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50'}`}
      >
        <FileSpreadsheet size={40} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{file ? file.name : 'Drag & drop your CSV file here'}</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
          <Upload size={16} /> Browse Files
          <input type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
      </div>

      {parsed.length > 0 && (
        <>
          {/* Validation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{parsed.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Rows</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{validCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Valid</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{errors.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Errors</p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><AlertCircle size={16} className="text-red-600 dark:text-red-400" /><p className="text-sm font-medium text-red-800 dark:text-red-300">{errors.length} row(s) have errors</p></div>
              <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">{errors.map((r) => <li key={r.row}>Row {r.row}: {r.error}</li>)}</ul>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Row</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">SKU</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Stock</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th></tr></thead>
                <tbody>
                  {parsed.map((r) => (
                    <tr key={r.row} className={`border-b border-gray-100 dark:border-gray-700 ${r.error ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.row}</td><td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.name}</td><td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-400">{r.sku}</td><td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.category}</td><td className="px-4 py-2 text-gray-700 dark:text-gray-300">${r.price.toFixed(2)}</td><td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.stock}</td>
                      <td className="px-4 py-2">{r.error ? <span className="text-red-600 dark:text-red-400 text-xs">{r.error}</span> : <CheckCircle size={14} className="text-green-500 dark:text-green-400" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress bar during import */}
          {importing && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
            </div>
          )}

          <button onClick={confirmImport} disabled={importing || errors.length === parsed.length} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {importing ? `Importing... ${importProgress}%` : `Import ${validCount} Products`}
          </button>
        </>
      )}
    </div>
  );
}
