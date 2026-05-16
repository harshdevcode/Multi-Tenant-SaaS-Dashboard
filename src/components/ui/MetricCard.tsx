interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
}

export function MetricCard({ label, value, delta, deltaPositive }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {delta && (
        <p className={`text-xs mt-1 ${deltaPositive ? 'text-green-700' : 'text-red-700'}`}>
          {delta}
        </p>
      )}
    </div>
  )
}
