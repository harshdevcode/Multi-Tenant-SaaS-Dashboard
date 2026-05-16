import type { RootState } from '@/app/store'
import { hasPermission } from '@/utils/permissions'
import type { Permission } from '@/types'

export const selectUser = (state: RootState) => state.auth.user
export const selectRole = (state: RootState) => state.auth.user?.role
export const selectTenantId = (state: RootState) => state.auth.user?.tenantId
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectToken = (state: RootState) => state.auth.token

/**
 * Memoized permission selector factory.
 * Usage: const canRead = useSelector(selectCanDo('billing:read'))
 */
export const selectCanDo = (permission: Permission) => (state: RootState) => {
  const role = selectRole(state)
  if (!role) return false
  return hasPermission(role, permission)
}
