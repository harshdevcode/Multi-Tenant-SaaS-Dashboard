import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoginPage } from '@/features/auth/LoginPage'

// Route-level code splitting with React.lazy
// Each page chunk is only loaded when the user navigates to that route.
// Viewers never download billing/settings code; admins don't pay for unused chunks.
const OverviewPage  = lazy(() => import('@/features/tenants/OverviewPage').then(m => ({ default: m.OverviewPage })))
const TenantsPage   = lazy(() => import('@/features/tenants/TenantsPage').then(m => ({ default: m.TenantsPage })))
const BillingPage   = lazy(() => import('@/features/billing/BillingPage').then(m => ({ default: m.BillingPage })))
const UsersPage     = lazy(() => import('@/features/users/UsersPage').then(m => ({ default: m.UsersPage })))
const SettingsPage  = lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))

const pageLoader = (
  <div className="flex items-center justify-center h-32">
    <div className="text-sm text-gray-400">Loading...</div>
  </div>
)

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      // Top-level auth guard — all /dashboard/* routes require auth
      element: <ProtectedRoute requireAuth />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            {
              path: '/dashboard',
              element: (
                <Suspense fallback={pageLoader}>
                  <OverviewPage />
                </Suspense>
              ),
            },
            {
              path: '/dashboard/tenants',
              element: (
                <Suspense fallback={pageLoader}>
                  <TenantsPage />
                </Suspense>
              ),
            },
            {
              // Billing requires billing:read permission — viewers get redirected
              element: <ProtectedRoute requirePermission="billing:read" />,
              children: [
                {
                  path: '/dashboard/billing',
                  element: (
                    <Suspense fallback={pageLoader}>
                      <BillingPage />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              element: <ProtectedRoute requirePermission="users:read" />,
              children: [
                {
                  path: '/dashboard/users',
                  element: (
                    <Suspense fallback={pageLoader}>
                      <UsersPage />
                    </Suspense>
                  ),
                },
              ],
            },
            {
              // Settings requires settings:read — only admin
              element: <ProtectedRoute requirePermission="settings:read" />,
              children: [
                {
                  path: '/dashboard/settings',
                  element: (
                    <Suspense fallback={pageLoader}>
                      <SettingsPage />
                    </Suspense>
                  ),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)
