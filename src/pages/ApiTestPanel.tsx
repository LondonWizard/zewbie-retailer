import { useState } from 'react'
import api from '../lib/api'

interface TestResult {
  label: string
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
}

const TEST_GROUPS = [
  {
    section: 'System',
    tests: [{ label: 'Health Check — GET /system/health', endpoint: '/system/health', method: 'GET' }],
  },
  {
    section: 'Retailer Auth',
    tests: [
      { label: 'Login — POST /retailers/auth/login', endpoint: '/retailers/auth/login', method: 'POST' },
      { label: 'Me — GET /retailers/auth/me', endpoint: '/retailers/auth/me', method: 'GET' },
    ],
  },
  {
    section: 'Products CRUD',
    tests: [
      { label: 'List Products — GET /retailers/products', endpoint: '/retailers/products', method: 'GET' },
      { label: 'Create Product — POST /retailers/products', endpoint: '/retailers/products', method: 'POST' },
    ],
  },
  {
    section: 'Orders',
    tests: [
      { label: 'List Orders — GET /retailers/orders', endpoint: '/retailers/orders', method: 'GET' },
    ],
  },
  {
    section: 'Inventory',
    tests: [
      { label: 'Get Inventory — GET /retailers/inventory', endpoint: '/retailers/inventory', method: 'GET' },
    ],
  },
]

/** Interactive API test panel for verifying backend connectivity */
export default function ApiTestPanel() {
  const [results, setResults] = useState<Record<string, TestResult>>({})

  async function runTest(label: string, endpoint: string, method: string) {
    setResults((prev) => ({ ...prev, [label]: { label, status: 'loading' } }))
    try {
      const res = method === 'GET' ? await api.get(endpoint) : await api.post(endpoint, {})
      setResults((prev) => ({ ...prev, [label]: { label, status: 'success', data: res.data } }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setResults((prev) => ({ ...prev, [label]: { label, status: 'error', data: message } }))
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">API Test Panel</h1>
      <p className="text-gray-500 mb-4">Route: /api-test</p>
      <p className="text-gray-600 mb-6">
        Test backend API endpoints directly from the browser.
      </p>

      <div className="space-y-6">
        {TEST_GROUPS.map((group) => (
          <div key={group.section}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{group.section}</h2>
            <div className="space-y-2">
              {group.tests.map((test) => {
                const result = results[test.label]
                return (
                  <div
                    key={test.label}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">{test.label}</p>
                      {result?.status === 'success' && (
                        <pre className="mt-1 text-xs text-green-700 max-h-24 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                      {result?.status === 'error' && (
                        <p className="mt-1 text-xs text-red-600">{String(result.data)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => runTest(test.label, test.endpoint, test.method)}
                      disabled={result?.status === 'loading'}
                      className="shrink-0 ml-4 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {result?.status === 'loading' ? 'Running...' : 'Run'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
