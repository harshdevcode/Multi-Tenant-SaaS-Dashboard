import { http, HttpResponse } from 'msw'
import type { AuthUser, Tenant, TenantUser, Invoice, BillingMetrics, OverviewMetrics } from '@/types'

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockUser: AuthUser = {
  id: 'user-1',
  email: 'admin@saaspilot.io',
  name: 'Alex Chen',
  role: 'admin',
  tenantId: 'tenant-1',
  avatarInitials: 'AC',
}

const mockTenants: Tenant[] = [
  { id: 'tenant-1', name: 'Acme Corp', plan: 'enterprise', status: 'active', mrr: 420000, userCount: 38, createdAt: '2023-01-10T00:00:00Z', domain: 'acme.com' },
  { id: 'tenant-2', name: 'BrightWave', plan: 'pro', status: 'active', mrr: 89000, userCount: 12, createdAt: '2023-03-22T00:00:00Z', domain: 'brightwave.io' },
  { id: 'tenant-3', name: 'Zenith Labs', plan: 'starter', status: 'trial', mrr: 12000, userCount: 3, createdAt: '2023-11-05T00:00:00Z', domain: 'zenithlabs.co' },
  { id: 'tenant-4', name: 'OceanMind', plan: 'pro', status: 'churned', mrr: 0, userCount: 0, createdAt: '2022-09-14T00:00:00Z', domain: 'oceanmind.ai' },
  { id: 'tenant-5', name: 'PixelForge', plan: 'enterprise', status: 'active', mrr: 360000, userCount: 27, createdAt: '2022-06-01T00:00:00Z', domain: 'pixelforge.com' },
]

const mockUsers: TenantUser[] = [
  { id: 'u-1', name: 'Sarah Kim', email: 's.kim@acme.com', role: 'admin', tenantId: 'tenant-1', lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isActive: true },
  { id: 'u-2', name: 'Marco Torres', email: 'm.torres@acme.com', role: 'manager', tenantId: 'tenant-1', lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isActive: true },
  { id: 'u-3', name: 'Lin Zhao', email: 'l.zhao@acme.com', role: 'viewer', tenantId: 'tenant-1', lastActiveAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isActive: true },
  { id: 'u-4', name: 'Alex M.', email: 'a.m@acme.com', role: 'viewer', tenantId: 'tenant-1', lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), isActive: false },
]

const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-0041', tenantId: 'tenant-1', tenantName: 'Acme Corp', amountCents: 420000, status: 'paid', issuedAt: '2024-03-01T00:00:00Z', dueAt: '2024-03-15T00:00:00Z' },
  { id: 'inv-2', invoiceNumber: 'INV-0040', tenantId: 'tenant-5', tenantName: 'PixelForge', amountCents: 360000, status: 'paid', issuedAt: '2024-03-01T00:00:00Z', dueAt: '2024-03-15T00:00:00Z' },
  { id: 'inv-3', invoiceNumber: 'INV-0039', tenantId: 'tenant-2', tenantName: 'BrightWave', amountCents: 89000, status: 'paid', issuedAt: '2024-03-01T00:00:00Z', dueAt: '2024-03-15T00:00:00Z' },
  { id: 'inv-4', invoiceNumber: 'INV-0038', tenantId: 'tenant-3', tenantName: 'Zenith Labs', amountCents: 12000, status: 'pending', issuedAt: '2024-03-01T00:00:00Z', dueAt: '2024-03-30T00:00:00Z' },
]

const mockBillingMetrics: BillingMetrics = {
  mrrCents: 881000,
  arrCents: 10572000,
  outstandingCents: 0,
  nextPayoutDate: '2024-05-01T00:00:00Z',
  mrrGrowthPercent: 12.4,
}

const mockOverview: OverviewMetrics = {
  mrrCents: 881000,
  mrrGrowthPercent: 12.4,
  activeTenants: 4,
  newTenantsThisMonth: 1,
  totalUsers: 89,
  newUsersThisWeek: 7,
  churnRatePercent: 2.1,
  churnRateDeltaPoints: 0.4,
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [
  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'admin@saaspilot.io' && body.password === 'password') {
      return HttpResponse.json({ user: mockUser, token: 'mock-jwt-token' })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json(mockUser)
  }),

  // Tenants
  http.get('/api/tenants', () => {
    return HttpResponse.json(mockTenants)
  }),

  http.delete('/api/tenants/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Users
  http.get('/api/tenants/:tenantId/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  // Billing
  http.get('/api/billing/metrics', () => {
    return HttpResponse.json(mockBillingMetrics)
  }),

  http.get('/api/billing/invoices', () => {
    return HttpResponse.json(mockInvoices)
  }),

  // Analytics
  http.get('/api/analytics/overview', () => {
    return HttpResponse.json(mockOverview)
  }),

  http.get('/api/analytics/mrr-history', () => {
    const data = [
      { month: 'Nov', mrrCents: 620000 },
      { month: 'Dec', mrrCents: 710000 },
      { month: 'Jan', mrrCents: 730000 },
      { month: 'Feb', mrrCents: 790000 },
      { month: 'Mar', mrrCents: 840000 },
      { month: 'Apr', mrrCents: 881000 },
    ]
    return HttpResponse.json(data)
  }),

  http.get('/api/analytics/revenue-by-plan', () => {
    const data = [
      { plan: 'enterprise', mrrCents: 780000, percentage: 88.5 },
      { plan: 'pro', mrrCents: 89000, percentage: 10.1 },
      { plan: 'starter', mrrCents: 12000, percentage: 1.4 },
    ]
    return HttpResponse.json(data)
  }),
]
