import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsApi, usersApi, billingApi, analyticsApi } from '@/lib/api'
import { useAppSelector } from '@/app/hooks'
import { selectTenantId } from '@/features/auth/authSelectors'

// ─── Query key constants ──────────────────────────────────────────────────────
// Centralising keys prevents typos and makes invalidation explicit.
export const queryKeys = {
  tenants: ['tenants'] as const,
  tenant: (id: string) => ['tenants', id] as const,
  users: (tenantId: string) => ['users', tenantId] as const,
  billingMetrics: ['billing', 'metrics'] as const,
  invoices: ['billing', 'invoices'] as const,
  overview: ['analytics', 'overview'] as const,
  mrrHistory: ['analytics', 'mrr-history'] as const,
  revenueByPlan: ['analytics', 'revenue-by-plan'] as const,
}

// ─── Tenants ──────────────────────────────────────────────────────────────────

export function useTenants() {
  return useQuery({
    queryKey: queryKeys.tenants,
    queryFn: tenantsApi.list,
  })
}

export function useDeleteTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: tenantsApi.remove,
    onSuccess: () => {
      // Invalidate tenant list so it refetches with the deleted entry removed
      qc.invalidateQueries({ queryKey: queryKeys.tenants })
    },
  })
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function useUsers() {
  // tenantId is part of the query key — if it changes (admin switches tenant),
  // React Query automatically refetches with the new context.
  const tenantId = useAppSelector(selectTenantId)

  return useQuery({
    queryKey: queryKeys.users(tenantId ?? ''),
    queryFn: () => usersApi.list(tenantId ?? ''),
    enabled: !!tenantId,
  })
}

export function useRemoveUser() {
  const qc = useQueryClient()
  const tenantId = useAppSelector(selectTenantId)

  return useMutation({
    mutationFn: (userId: string) => usersApi.remove(tenantId ?? '', userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users(tenantId ?? '') })
    },
  })
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export function useBillingMetrics() {
  return useQuery({
    queryKey: queryKeys.billingMetrics,
    queryFn: billingApi.metrics,
  })
}

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices,
    queryFn: billingApi.invoices,
  })
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useOverviewMetrics() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: analyticsApi.overview,
  })
}

export function useMrrHistory() {
  return useQuery({
    queryKey: queryKeys.mrrHistory,
    queryFn: analyticsApi.mrrHistory,
  })
}

export function useRevenueByPlan() {
  return useQuery({
    queryKey: queryKeys.revenueByPlan,
    queryFn: analyticsApi.revenueByPlan,
  })
}
