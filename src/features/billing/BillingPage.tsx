import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { MetricCard } from '@/components/ui/MetricCard'
import { InvoiceBadge } from '@/components/ui/Badge'
import { useBillingMetrics, useInvoices, useMrrHistory } from '@/hooks/useQueries'
import { formatCents, formatDelta, formatDate } from '@/utils/format'

export function BillingPage() {
  const { data: metrics, isLoading } = useBillingMetrics()
  const { data: invoices } = useInvoices()
  const { data: mrrHistory } = useMrrHistory()

  if (isLoading) {
    return <div className="text-sm text-gray-400 p-4">Loading billing data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue and invoices</p>
        </div>
        <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors">
          Download invoices
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="MRR"
          value={formatCents(metrics?.mrrCents ?? 0)}
          delta={formatDelta(metrics?.mrrGrowthPercent ?? 0)}
          deltaPositive={(metrics?.mrrGrowthPercent ?? 0) >= 0}
        />
        <MetricCard
          label="ARR"
          value={formatCents(metrics?.arrCents ?? 0, true)}
          delta="+15%"
          deltaPositive
        />
        <MetricCard
          label="Outstanding"
          value={formatCents(metrics?.outstandingCents ?? 0)}
          delta="All paid"
          deltaPositive
        />
        <MetricCard
          label="Next payout"
          value={metrics?.nextPayoutDate ? formatDate(metrics.nextPayoutDate) : '—'}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-800 mb-4">Monthly revenue</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mrrHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 100000).toFixed(0)}k`}
            />
            <Tooltip formatter={(v: number) => formatCents(v)} />
            <Bar dataKey="mrrCents" fill="#2563eb" radius={[3, 3, 0, 0]} name="MRR" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Recent invoices</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Tenant</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Issued</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices?.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-700">{inv.tenantName}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatCents(inv.amountCents)}</td>
                <td className="px-4 py-3 text-gray-400">{formatDate(inv.issuedAt)}</td>
                <td className="px-4 py-3"><InvoiceBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
