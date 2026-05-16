import { useAppSelector } from '@/app/hooks'
import { selectRole } from '@/features/auth/authSelectors'
import { hasPermission, hasAllPermissions, hasAnyPermission } from '@/utils/permissions'
import type { Permission } from '@/types'

/**
 * Primary RBAC hook.
 *
 * Usage:
 *   const can = usePermission()
 *   if (can('billing:read')) { ... }
 *
 * This reads the role from Redux — it's synchronous and zero-cost.
 * All permission logic is derived from the role; no separate API call needed.
 */
export function usePermission() {
  const role = useAppSelector(selectRole)

  return (permission: Permission): boolean => {
    if (!role) return false
    return hasPermission(role, permission)
  }
}

/**
 * Check multiple permissions at once.
 *
 * Usage:
 *   const { canAll, canAny } = usePermissions()
 *   const canManage = canAll(['users:read', 'users:write'])
 */
export function usePermissions() {
  const role = useAppSelector(selectRole)

  const canAll = (permissions: Permission[]): boolean => {
    if (!role) return false
    return hasAllPermissions(role, permissions)
  }

  const canAny = (permissions: Permission[]): boolean => {
    if (!role) return false
    return hasAnyPermission(role, permissions)
  }

  return { canAll, canAny }
}

/**
 * Returns the current user's role.
 * Prefer usePermission() for access checks; use this only when you need
 * to display the role label in the UI.
 */
export function useRole() {
  return useAppSelector(selectRole)
}
