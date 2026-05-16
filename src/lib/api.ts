import axios from 'axios'
import { store } from '@/app/store'
import { logout } from '@/features/auth/authSlice'
import type {
  AuthUser,
  Tenant,
  TenantUser,
  Invoice,
  BillingMetrics,
  OverviewMetrics,
  MrrDataPoint,
  RevenueByPlan,
} from '@/types'

// ─── Axios instance ───────────────────────────────────────────────────────────

type ViteImportMeta = {
  env?: Record<string, string | undefined>
}

const getViteEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key]
  }

  try {
    return (eval('import.meta') as ViteImportMeta).env?.[key]
  } catch {
    return undefined
  }
}

export const apiClient = axios.create({
  baseURL: getViteEnv('VITE_API_BASE_URL') ?? '/api',
  timeout: 10_000,
})

// ─── Request interceptor: attach token + tenantId ─────────────────────────────
// This runs on EVERY outgoing request — no component has to remember to do this.
apiClient.interceptors.request.use((config) => {
  const state = store.getState()
  const { token, user } = state.auth

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (user?.tenantId) {
    config.headers['X-Tenant-ID'] = user.tenantId
  }
  return config
})

// ─── Response interceptor: handle 401 globally ───────────────────────────────
// If the JWT expires mid-session, all requests fail with 401.
// Instead of every component handling this, one interceptor catches it all.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<{ user: AuthUser; token: string }>(
      '/auth/login',
      credentials
    )
    return res.data
  },
  me: async (token: string) => {
    const res = await apiClient.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}

// ─── Tenants API ──────────────────────────────────────────────────────────────

export const tenantsApi = {
  list: async () => {
    const res = await apiClient.get<Tenant[]>('/tenants')
    return res.data
  },
  getById: async (id: string) => {
    const res = await apiClient.get<Tenant>(`/tenants/${id}`)
    return res.data
  },
  create: async (payload: Omit<Tenant, 'id' | 'createdAt'>) => {
    const res = await apiClient.post<Tenant>('/tenants', payload)
    return res.data
  },
  remove: async (id: string) => {
    await apiClient.delete(`/tenants/${id}`)
  },
}

// ─── Users API ────────────────────────────────────────────────────────────────

export const usersApi = {
  list: async (tenantId: string) => {
    const res = await apiClient.get<TenantUser[]>(`/tenants/${tenantId}/users`)
    return res.data
  },
  invite: async (tenantId: string, payload: { email: string; role: string }) => {
    const res = await apiClient.post<TenantUser>(`/tenants/${tenantId}/users`, payload)
    return res.data
  },
  remove: async (tenantId: string, userId: string) => {
    await apiClient.delete(`/tenants/${tenantId}/users/${userId}`)
  },
}

// ─── Billing API ──────────────────────────────────────────────────────────────

export const billingApi = {
  metrics: async () => {
    const res = await apiClient.get<BillingMetrics>('/billing/metrics')
    return res.data
  },
  invoices: async () => {
    const res = await apiClient.get<Invoice[]>('/billing/invoices')
    return res.data
  },
}

// ─── Analytics API ────────────────────────────────────────────────────────────

export const analyticsApi = {
  overview: async () => {
    const res = await apiClient.get<OverviewMetrics>('/analytics/overview')
    return res.data
  },
  mrrHistory: async () => {
    const res = await apiClient.get<MrrDataPoint[]>('/analytics/mrr-history')
    return res.data
  },
  revenueByPlan: async () => {
    const res = await apiClient.get<RevenueByPlan[]>('/analytics/revenue-by-plan')
    return res.data
  },
}
