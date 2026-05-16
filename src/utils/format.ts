/**
 * Format cents to a human-readable currency string.
 * e.g. 420000 → "$4,200"
 */
export function formatCents(cents: number, compact = false): string {
  const dollars = cents / 100
  if (compact && dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(1)}M`
  }
  if (compact && dollars >= 1_000) {
    return `$${(dollars / 1_000).toFixed(0)}k`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars)
}

/**
 * Format a percentage delta with sign.
 * e.g. 12.4 → "+12.4%", -2.1 → "-2.1%"
 */
export function formatDelta(value: number, unit = '%'): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}${unit}`
}

/**
 * Format an ISO date string to a readable label.
 * e.g. "2024-01-15T00:00:00Z" → "Jan 15, 2024"
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

/**
 * Format a relative time string.
 * e.g. a date 2 hours ago → "2h ago"
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(iso)
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
