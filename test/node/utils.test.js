import test from 'node:test'
import assert from 'node:assert'
import { formatMonthKey, startOfWeek, addDays, weekLabel } from '../../lib/utils.js'

test('formatMonthKey returns YYYY-MM', () => {
  const d = new Date('2026-02-07')
  assert.strictEqual(formatMonthKey(d), '2026-02')
})

test('startOfWeek is Monday', () => {
  const d = new Date('2026-02-07') // Saturday
  const s = startOfWeek(d)
  // Monday of that week is 2026-02-02
  assert.strictEqual(s.getDay(), 1)
  assert.strictEqual(s.toISOString().slice(0,10), '2026-02-02')
})

test('addDays shifts date', () => {
  const d = new Date('2026-02-01')
  const n = addDays(d, 5)
  assert.strictEqual(n.toISOString().slice(0,10), '2026-02-06')
})

test('weekLabel returns range', () => {
  const s = new Date('2026-02-02')
  const label = weekLabel(s)
  assert.ok(label.includes('2026'))
})
