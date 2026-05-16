import { NavLink } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'

interface NavItem {
  label: string
  to: string
  permission?: Parameters<ReturnType<typeof usePermission>>[0]
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    to: '/dashboard',
    icon: <GridIcon />,
  },
  {
    label: 'Tenants',
    to: '/dashboard/tenants',
    permission: 'tenants:read',
    icon: <TenantsIcon />,
  },
  {
    label: 'Billing',
    to: '/dashboard/billing',
    permission: 'billing:read',
    icon: <BillingIcon />,
  },
  {
    label: 'Users',
    to: '/dashboard/users',
    permission: 'users:read',
    icon: <UsersIcon />,
  },
  {
    label: 'Settings',
    to: '/dashboard/settings',
    permission: 'settings:read',
    icon: <SettingsIcon />,
  },
]

export function Sidebar() {
  const can = usePermission()

  return (
    <aside className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col py-3 px-2 gap-0.5">
      {navItems.map((item) => {
        const allowed = !item.permission || can(item.permission)
        if (!allowed) return null

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white text-gray-900 font-medium shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:bg-white hover:text-gray-800'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        )
      })}
    </aside>
  )
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  )
}

function TenantsIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
      <circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 12c0-1.7 1.3-3 3-3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function BillingIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 6h12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
