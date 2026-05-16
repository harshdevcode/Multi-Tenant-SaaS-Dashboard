// ─── Roles ───────────────────────────────────────────────────────────────────
export type Role = 'admin' | 'manager' | 'viewer'

// ─── Permissions ─────────────────────────────────────────────────────────────
// Each permission is a `resource:action` string.
// Adding a new permission here forces TypeScript to update the PermissionMatrix.
export type Permission =
  | 'tenants:read'
  | 'tenants:write'
  | 'tenants:delete'
  | 'billing:read'
  | 'users:read'
  | 'users:write'
  | 'settings:read'
  | 'settings:write'
  | 'analytics:read'
  | 'export:run'

// ─── Permission Matrix ────────────────────────────────────────────────────────
// Single source of truth. TypeScript ensures every Role is covered.
export type PermissionMatrix = Record<Role, readonly Permission[]>

export const PERMISSION_MATRIX: PermissionMatrix = {
  admin: [
    'tenants:read', 'tenants:write', 'tenants:delete',
    'billing:read',
    'users:read', 'users:write',
    'settings:read', 'settings:write',
    'analytics:read',
    'export:run',
  ],
  manager: [
    'tenants:read', 'tenants:write',
    'billing:read',
    'users:read', 'users:write',
    'analytics:read',
    'export:run',
  ],
  viewer: [
    'tenants:read',
    'analytics:read',
  ],
} as const

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  tenantId: string
  avatarInitials: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ─── Tenant ───────────────────────────────────────────────────────────────────
export type TenantStatus = 'active' | 'trial' | 'churned' | 'suspended'
export type PlanType = 'starter' | 'pro' | 'enterprise'

export interface Tenant {
  id: string
  name: string
  plan: PlanType
  status: TenantStatus
  mrr: number          // Monthly Recurring Revenue in cents
  userCount: number
  createdAt: string    // ISO date string
  domain: string
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface TenantUser {
  id: string
  name: string
  email: string
  role: Role
  tenantId: string
  lastActiveAt: string
  isActive: boolean
}

// ─── Billing ──────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface Invoice {
  id: string
  invoiceNumber: string
  tenantId: string
  tenantName: string
  amountCents: number
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
}

export interface BillingMetrics {
  mrrCents: number
  arrCents: number
  outstandingCents: number
  nextPayoutDate: string
  mrrGrowthPercent: number
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface MrrDataPoint {
  month: string      // e.g. "Jan 2024"
  mrrCents: number
}

export interface RevenueByPlan {
  plan: PlanType
  mrrCents: number
  percentage: number
}

export interface OverviewMetrics {
  mrrCents: number
  mrrGrowthPercent: number
  activeTenants: number
  newTenantsThisMonth: number
  totalUsers: number
  newUsersThisWeek: number
  churnRatePercent: number
  churnRateDeltaPoints: number
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiError {
  message: string
  statusCode: number
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
