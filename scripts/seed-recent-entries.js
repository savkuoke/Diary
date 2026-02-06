#!/usr/bin/env node
// Seed helper: insert a few entries for the current week and the previous week
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function main() {
  const db = await import(path.join(root, 'lib', 'db.js'))

  const now = new Date()
  // Helper to format YYYY-MM-DD (date-only) — app stores dates as strings
  const fmt = d => d.toISOString().slice(0, 10)

  // Find start of week (Sunday) and previous week start
  const day = now.getDay() // 0 (Sun) - 6
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - day)
  sunday.setHours(0,0,0,0)

  const prevSunday = new Date(sunday)
  prevSunday.setDate(sunday.getDate() - 7)

  const sampleThisWeek = [
    { date: fmt(new Date(sunday.getTime() + 2 * 24*60*60*1000)), weight: '70', steps: 8000, mood: 'good', notes: 'Midweek walk' },
    { date: fmt(new Date(sunday.getTime() + 4 * 24*60*60*1000)), weight: '69.8', steps: 10000, mood: 'great', notes: 'Gym session' }
  ]

  const samplePrevWeek = [
    { date: fmt(new Date(prevSunday.getTime() + 1 * 24*60*60*1000)), weight: '71', steps: 6000, mood: 'ok', notes: 'Short walk' },
    { date: fmt(new Date(prevSunday.getTime() + 5 * 24*60*60*1000)), weight: '70.5', steps: 7500, mood: 'good', notes: 'Weekend hike' }
  ]

  let inserted = 0
  for (const e of [...sampleThisWeek, ...samplePrevWeek]) {
    try {
      const res = db.createEntry(e)
      if (res && typeof res.then === 'function') await res
      inserted++
      console.log('Inserted:', e.date, e.steps, e.mood)
    } catch (err) {
      console.error('Failed to insert', e, err)
    }
  }

  console.log(`Done — inserted ${inserted} entries.`)
}

main().catch(err => { console.error(err); process.exit(1) })
