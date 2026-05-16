import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSelectors'
import { logout, switchTenant } from '@/features/auth/authSlice'
import { RoleBadge } from '@/components/ui/Badge'
import { Can } from '@/components/ui/Can'
import { useTenants } from '@/hooks/useQueries'

export function TopBar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const { data: tenants } = useTenants()

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(switchTenant(e.target.value))
  }

  return (
    <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-medium text-gray-900">SaaSPilot</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Tenant switcher — only admins can switch context */}
        <Can do="settings:write">
          <select
            className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-gray-50 text-gray-700"
            value={user?.tenantId}
            onChange={handleTenantChange}
          >
            {tenants?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Can>

        {user?.role && <RoleBadge role={user.role} />}

        <span className="text-sm text-gray-600">{user?.name}</span>

        <button
          onClick={() => dispatch(logout())}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
