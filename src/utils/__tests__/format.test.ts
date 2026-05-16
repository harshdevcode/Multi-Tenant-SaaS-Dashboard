import { formatCents, formatDelta, formatRelativeTime, capitalize } from '@/utils/format'

describe('formatCents', () => {
  it('formats zero correctly', () => {
    expect(formatCents(0)).toBe('$0')
  })

  it('formats whole dollar amounts', () => {
    expect(formatCents(420000)).toBe('$4,200')
  })

  it('formats large amounts with commas', () => {
    expect(formatCents(1000000)).toBe('$10,000')
  })

  it('formats compact thousands', () => {
    expect(formatCents(1000000, true)).toBe('$10k')
  })

  it('formats compact millions', () => {
    expect(formatCents(150000000, true)).toBe('$1.5M')
  })
})

describe('formatDelta', () => {
  it('adds + sign for positive values', () => {
    expect(formatDelta(12.4)).toBe('+12.4%')
  })

  it('shows - sign for negative values', () => {
    expect(formatDelta(-2.1)).toBe('-2.1%')
  })

  it('formats zero as positive', () => {
    expect(formatDelta(0)).toBe('+0.0%')
  })

  it('supports custom unit', () => {
    expect(formatDelta(0.4, 'pts')).toBe('+0.4pts')
  })
})

describe('formatRelativeTime', () => {
  it('formats minutes ago', () => {
    const iso = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    expect(formatRelativeTime(iso)).toBe('30m ago')
  })

  it('formats hours ago', () => {
    const iso = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(iso)).toBe('3h ago')
  })

  it('formats days ago', () => {
    const iso = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(iso)).toBe('2d ago')
  })
})

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('admin')).toBe('Admin')
  })

  it('leaves rest of string unchanged', () => {
    expect(capitalize('helloWorld')).toBe('HelloWorld')
  })

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})
