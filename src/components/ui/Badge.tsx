import type { Role, TenantStatus, InvoiceStatus, PlanType } from '@/types'
import { capitalize } from '@/utils/format'

// ─── Role badge ───────────────────────────────────────────────────────────────

const roleBadgeStyles: Record<Role, string> = {
  admin:   'bg-blue-100 text-blue-800',
  manager: 'bg-green-100 text-green-800',
  viewer:  'bg-amber-100 text-amber-800',
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${roleBadgeStyles[role]}`}>
      {capitalize(role)}
    </span>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusBadgeStyles: Record<TenantStatus, string> = {
  active:    'bg-green-100 text-green-800',
  trial:     'bg-amber-100 text-amber-800',
  churned:   'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-700',
}

export function StatusBadge({ status }: { status: TenantStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusBadgeStyles[status]}`}>
      {capitalize(status)}
    </span>
  )
}

// ─── Invoice status badge ─────────────────────────────────────────────────────

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  paid:    'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  overdue: 'bg-red-100 text-red-800',
}

export function InvoiceBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${invoiceStatusStyles[status]}`}>
      {capitalize(status)}
    </span>
  )
}

// ─── Plan badge ───────────────────────────────────────────────────────────────

const planBadgeStyles: Record<PlanType, string> = {
  starter:    'bg-gray-100 text-gray-700',
  pro:        'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800',
}

export function PlanBadge({ plan }: { plan: PlanType }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${planBadgeStyles[plan]}`}>
      {capitalize(plan)}
    </span>
  )
}
