import { useTenants, useDeleteTenant } from '@/hooks/useQueries'
import { Can } from '@/components/ui/Can'
import { StatusBadge, PlanBadge } from '@/components/ui/Badge'
import { formatCents, formatDate } from '@/utils/format'
import { usePermission } from '@/hooks/usePermission'

export function TenantsPage() {
  const { data: tenants, isLoading } = useTenants()
  const { mutate: deleteTenant, isPending: isDeleting } = useDeleteTenant()
  const can = usePermission()

  if (isLoading) {
    return <div className="text-sm text-gray-400 p-4">Loading tenants...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tenants?.length ?? 0} organizations</p>
        </div>
        <Can do="tenants:write">
          <button className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            + Add tenant
          </button>
        </Can>
      </div>

      {/* Read-only notice for viewers */}
      {!can('tenants:write') && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <span>&#128274;</span>
          <span>You have read-only access. Contact an admin to make changes.</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">MRR</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Users</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Since</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenants?.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{tenant.name}</td>
                <td className="px-4 py-3"><PlanBadge plan={tenant.plan} /></td>
                <td className="px-4 py-3 text-gray-700">{formatCents(tenant.mrr)}</td>
                <td className="px-4 py-3 text-gray-500">{tenant.userCount}</td>
                <td className="px-4 py-3"><StatusBadge status={tenant.status} /></td>
                <td className="px-4 py-3 text-gray-400">{formatDate(tenant.createdAt)}</td>
                <td className="px-4 py-3">
                  <Can do="tenants:delete">
                    <button
                      onClick={() => deleteTenant(tenant.id)}
                      disabled={isDeleting}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
