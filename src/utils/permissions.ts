import { PERMISSION_MATRIX } from '@/types'
import type { Permission, Role } from '@/types'

/**
 * Check if a role has a specific permission.
 * Pure function — no side effects, easy to test.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return (PERMISSION_MATRIX[role] as readonly Permission[]).includes(permission)
}

/**
 * Check if a role has ALL of the given permissions.
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Check if a role has ANY of the given permissions.
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Get all permissions for a role.
 */
export function getPermissionsForRole(role: Role): readonly Permission[] {
  return PERMISSION_MATRIX[role]
}
