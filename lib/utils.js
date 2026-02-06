export function formatMonthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })
}

export function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0,0,0,0)
  return d
}

export function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function weekLabel(start) {
  const end = addDays(start, 6)
  return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`
}
