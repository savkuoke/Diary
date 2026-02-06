import { describe, it, expect } from 'vitest'
import { startOfWeek } from '../lib/utils.js'

describe('weekly steps sum', () => {
  it('sums steps for the selected week correctly', () => {
    const entries = [
      { id: 'a', date: '2026-02-02', steps: '7000' },
      { id: 'b', date: '2026-02-03', steps: 8000 },
      { id: 'c', date: '2026-02-05', steps: '6000' },
      { id: 'd', date: '2026-01-28', steps: '4500' },
    ]

    // build entriesByWeek as the app does
    const map = new Map()
    entries.forEach(e => {
      const d = new Date(e.date)
      const wk = startOfWeek(d).toISOString()
      if (!map.has(wk)) map.set(wk, [])
      map.get(wk).push(e)
    })

    const weekStart = startOfWeek(new Date('2026-02-02')).toISOString()
    const weekEntries = map.get(weekStart) || []
    const total = weekEntries.reduce((sum, en) => sum + (Number(en.steps) || 0), 0)

    expect(total).toBe(7000 + 8000 + 6000)
  })

  it('returns 0 when no entries in week', () => {
    const entries = [ { id: 'x', date: '2026-01-01', steps: '1000' } ]
    const map = new Map()
    entries.forEach(e => {
      const d = new Date(e.date)
      const wk = startOfWeek(d).toISOString()
      if (!map.has(wk)) map.set(wk, [])
      map.get(wk).push(e)
    })

    const weekStart = startOfWeek(new Date('2026-02-02')).toISOString()
    const weekEntries = map.get(weekStart) || []
    const total = weekEntries.reduce((sum, en) => sum + (Number(en.steps) || 0), 0)
    expect(total).toBe(0)
  })
})
