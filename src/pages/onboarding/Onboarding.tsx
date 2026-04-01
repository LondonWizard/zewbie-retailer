/** Multi-step retailer onboarding wizard */
export default function Onboarding() {
  const steps = [
    'Business Verification',
    'Business Profile',
    'Shipping Capabilities',
    'Banking / Payout Info',
    'First Product Listing',
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Retailer Onboarding</h1>
      <p className="text-gray-500 mb-4">Route: /onboarding</p>
      <p className="text-gray-600">
        Multi-step wizard guiding new retailers through account setup.
      </p>

      <div className="mt-6 space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
              {idx + 1}
            </span>
            <span className="text-gray-700">{step}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
