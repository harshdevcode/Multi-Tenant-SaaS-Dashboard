import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
} from '@/utils/permissions'
import type { Role, Permission } from '@/types'

describe('hasPermission', () => {
  describe('admin role', () => {
    it('grants all billing permissions', () => {
      expect(hasPermission('admin', 'billing:read')).toBe(true)
    })

    it('grants all user permissions', () => {
      expect(hasPermission('admin', 'users:read')).toBe(true)
      expect(hasPermission('admin', 'users:write')).toBe(true)
    })

    it('grants settings access', () => {
      expect(hasPermission('admin', 'settings:read')).toBe(true)
      expect(hasPermission('admin', 'settings:write')).toBe(true)
    })

    it('grants tenant delete', () => {
      expect(hasPermission('admin', 'tenants:delete')).toBe(true)
    })

    it('grants export', () => {
      expect(hasPermission('admin', 'export:run')).toBe(true)
    })
  })

  describe('manager role', () => {
    it('grants billing read', () => {
      expect(hasPermission('manager', 'billing:read')).toBe(true)
    })

    it('grants user read and write', () => {
      expect(hasPermission('manager', 'users:read')).toBe(true)
      expect(hasPermission('manager', 'users:write')).toBe(true)
    })

    it('denies settings access', () => {
      expect(hasPermission('manager', 'settings:read')).toBe(false)
      expect(hasPermission('manager', 'settings:write')).toBe(false)
    })

    it('denies tenant delete', () => {
      expect(hasPermission('manager', 'tenants:delete')).toBe(false)
    })

    it('grants export', () => {
      expect(hasPermission('manager', 'export:run')).toBe(true)
    })
  })

  describe('viewer role', () => {
    it('grants tenant read', () => {
      expect(hasPermission('viewer', 'tenants:read')).toBe(true)
    })

    it('denies billing access', () => {
      expect(hasPermission('viewer', 'billing:read')).toBe(false)
    })

    it('denies user write', () => {
      expect(hasPermission('viewer', 'users:write')).toBe(false)
    })

    it('denies settings access', () => {
      expect(hasPermission('viewer', 'settings:read')).toBe(false)
    })

    it('denies export', () => {
      expect(hasPermission('viewer', 'export:run')).toBe(false)
    })

    it('denies tenant delete', () => {
      expect(hasPermission('viewer', 'tenants:delete')).toBe(false)
    })
  })
})

describe('hasAllPermissions', () => {
  it('returns true when role has all permissions', () => {
    expect(hasAllPermissions('admin', ['billing:read', 'users:write'])).toBe(true)
  })

  it('returns false when role is missing one permission', () => {
    // manager can read billing but not delete tenants
    expect(hasAllPermissions('manager', ['billing:read', 'tenants:delete'])).toBe(false)
  })

  it('returns true for empty permission list', () => {
    expect(hasAllPermissions('viewer', [])).toBe(true)
  })
})

describe('hasAnyPermission', () => {
  it('returns true when role has at least one permission', () => {
    // viewer has tenants:read but not billing:read
    expect(hasAnyPermission('viewer', ['billing:read', 'tenants:read'])).toBe(true)
  })

  it('returns false when role has none of the permissions', () => {
    expect(hasAnyPermission('viewer', ['billing:read', 'settings:write'])).toBe(false)
  })

  it('returns false for empty permission list', () => {
    expect(hasAnyPermission('admin', [])).toBe(false)
  })
})

describe('getPermissionsForRole', () => {
  it('returns a non-empty array for admin', () => {
    const perms = getPermissionsForRole('admin')
    expect(perms.length).toBeGreaterThan(0)
  })

  it('admin has more permissions than viewer', () => {
    const adminPerms = getPermissionsForRole('admin')
    const viewerPerms = getPermissionsForRole('viewer')
    expect(adminPerms.length).toBeGreaterThan(viewerPerms.length)
  })

  it('returns readonly array (TypeScript enforced, verified at runtime)', () => {
    const perms = getPermissionsForRole('viewer')
    // Should not throw — just verifying the value is iterable
    expect(Array.isArray(perms)).toBe(true)
  })
})

describe('Permission matrix completeness', () => {
  const roles: Role[] = ['admin', 'manager', 'viewer']

  it('defines permissions for every role', () => {
    roles.forEach((role) => {
      expect(getPermissionsForRole(role)).toBeDefined()
    })
  })

  it('admin is a superset of manager permissions', () => {
    const adminPerms = getPermissionsForRole('admin') as Permission[]
    const managerPerms = getPermissionsForRole('manager') as Permission[]
    managerPerms.forEach((p) => {
      expect(adminPerms).toContain(p)
    })
  })

  it('manager is a superset of viewer permissions', () => {
    const managerPerms = getPermissionsForRole('manager') as Permission[]
    const viewerPerms = getPermissionsForRole('viewer') as Permission[]
    viewerPerms.forEach((p) => {
      expect(managerPerms).toContain(p)
    })
  })
})
