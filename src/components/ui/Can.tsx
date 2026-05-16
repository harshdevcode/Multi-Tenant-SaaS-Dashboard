import type { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'
import type { Permission } from '@/types'

interface CanProps {
  do: Permission
  children: ReactNode
  /** Optional fallback rendered when permission is denied */
  fallback?: ReactNode
}

/**
 * Declarative permission wrapper for UI elements.
 *
 * Usage:
 *   <Can do="users:write">
 *     <button>Invite user</button>
 *   </Can>
 *
 *   <Can do="billing:read" fallback={<AccessDenied />}>
 *     <BillingPage />
 *   </Can>
 *
 * This is purely a UX guard. The backend enforces actual access.
 */
export function Can({ do: permission, children, fallback = null }: CanProps) {
  const can = usePermission()
  return can(permission) ? <>{children}</> : <>{fallback}</>
}
