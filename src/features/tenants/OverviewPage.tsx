import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { MetricCard } from '@/components/ui/MetricCard'
import { Can } from '@/components/ui/Can'
import { useOverviewMetrics, useMrrHistory, useRevenueByPlan } from '@/hooks/useQueries'
import { formatCents, formatDelta } from '@/utils/format'

const PLAN_COLORS: Record<string, string> = {
  enterprise: '#2563eb',
  pro: '#16a34a',
  starter: '#d97706',
}

export function OverviewPage() {
  const { data: metrics, isLoading: metricsLoading } = useOverviewMetrics()
  const { data: mrrHistory } = useMrrHistory()
  const { data: revenueByPlan } = useRevenueByPlan()

  if (metricsLoading) {
    return <div className="text-sm text-gray-400 p-4">Loading metrics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">All tenants · last 30 days</p>
        </div>
        <Can do="export:run">
          <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors">
            Export CSV
          </button>
        </Can>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="MRR"
          value={formatCents(metrics?.mrrCents ?? 0)}
          delta={`${formatDelta(metrics?.mrrGrowthPercent ?? 0)} vs last mo`}
          deltaPositive={(metrics?.mrrGrowthPercent ?? 0) >= 0}
        />
        <MetricCard
          label="Active tenants"
          value={String(metrics?.activeTenants ?? 0)}
          delta={`+${metrics?.newTenantsThisMonth ?? 0} new`}
          deltaPositive
        />
        <MetricCard
          label="Total users"
          value={String(metrics?.totalUsers ?? 0)}
          delta={`+${metrics?.newUsersThisWeek ?? 0} this week`}
          deltaPositive
        />
        <MetricCard
          label="Churn rate"
          value={`${metrics?.churnRatePercent ?? 0}%`}
          delta={`${formatDelta(metrics?.churnRateDeltaPoints ?? 0, 'pts')}`}
          deltaPositive={false}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-4">MRR over time</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mrrHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 100000).toFixed(0)}k`}
              />
              <Tooltip formatter={(v: number) => formatCents(v)} />
              <Line
                type="monotone"
                dataKey="mrrCents"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="MRR"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Revenue by plan</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={revenueByPlan}
                dataKey="mrrCents"
                nameKey="plan"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
              >
                {revenueByPlan?.map((entry) => (
                  <Cell
                    key={entry.plan}
                    fill={PLAN_COLORS[entry.plan] ?? '#888'}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCents(v)} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs capitalize">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-800 mb-3">Recent activity</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-xs font-medium text-gray-500">Event</th>
              <th className="text-left py-2 text-xs font-medium text-gray-500">Tenant</th>
              <th className="text-left py-2 text-xs font-medium text-gray-500">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { event: 'Subscription upgraded', tenant: 'Acme Corp', time: '2h ago' },
              { event: 'New user invited', tenant: 'BrightWave', time: '5h ago' },
              { event: 'Trial started', tenant: 'Zenith Labs', time: '1d ago' },
              { event: 'Invoice paid', tenant: 'PixelForge', time: '2d ago' },
            ].map((row) => (
              <tr key={row.event + row.tenant}>
                <td className="py-2.5 text-gray-700">{row.event}</td>
                <td className="py-2.5 text-gray-500">{row.tenant}</td>
                <td className="py-2.5 text-gray-400">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
