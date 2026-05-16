import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated, selectRole } from '@/features/auth/authSelectors'
import { hasPermission } from '@/utils/permissions'
import type { Permission } from '@/types'

interface ProtectedRouteProps {
  /** If set, user must be authenticated */
  requireAuth?: boolean
  /** If set, user must have this permission */
  requirePermission?: Permission
  /** Where to redirect if guard fails. Defaults to '/login' or '/dashboard' */
  redirectTo?: string
}

/**
 * Route-level access guard.
 *
 * Renders <Outlet /> if all conditions pass.
 * Redirects otherwise — users never see a blank or broken page.
 *
 * Three layers of enforcement:
 * 1. This component guards at the router level (no blank pages)
 * 2. usePermission() guards individual UI elements (no orphaned buttons)
 * 3. The API backend guards every request (actual security)
 */
export function ProtectedRoute({
  requireAuth = true,
  requirePermission,
  redirectTo,
}: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const role = useAppSelector(selectRole)

  // Not logged in → send to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo ?? '/login'} replace />
  }

  // Logged in but lacks permission → send to dashboard (not login)
  if (requirePermission && role && !hasPermission(role, requirePermission)) {
    return <Navigate to={redirectTo ?? '/dashboard'} replace />
  }

  return <Outlet />
}
