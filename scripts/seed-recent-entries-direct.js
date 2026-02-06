#!/usr/bin/env node
// Direct seeding script: open data/diary.db via better-sqlite3 and insert a few rows
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function fmt(d){ return d.toISOString().slice(0,10) }

try {
  const Database = require('better-sqlite3')
  const dbPath = path.join(process.cwd(), 'data', 'diary.db')
  const db = new Database(dbPath)

  // ensure table exists (same schema as lib/db.js)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      date TEXT,
      weight TEXT,
      steps INTEGER,
      mood TEXT,
      notes TEXT
    )
  `).run()

  const now = new Date()
  const day = now.getDay()
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - day)
  sunday.setHours(0,0,0,0)
  const prevSunday = new Date(sunday)
  prevSunday.setDate(sunday.getDate() - 7)

  const samples = [
    { id: String(Date.now()+1), date: fmt(new Date(sunday.getTime()+2*24*60*60*1000)), weight:'70', steps:8000, mood:'good', notes:'Direct seed this week' },
    { id: String(Date.now()+2), date: fmt(new Date(sunday.getTime()+4*24*60*60*1000)), weight:'69.8', steps:10000, mood:'great', notes:'Direct seed this week' },
    { id: String(Date.now()+3), date: fmt(new Date(prevSunday.getTime()+1*24*60*60*1000)), weight:'71', steps:6000, mood:'ok', notes:'Direct seed prev week' },
    { id: String(Date.now()+4), date: fmt(new Date(prevSunday.getTime()+5*24*60*60*1000)), weight:'70.5', steps:7500, mood:'good', notes:'Direct seed prev week' }
  ]

  const insert = db.prepare('INSERT OR IGNORE INTO entries (id,date,weight,steps,mood,notes) VALUES (@id,@date,@weight,@steps,@mood,@notes)')
  let inserted = 0
  for (const s of samples) {
    try { insert.run(s); inserted++ } catch (err) { console.error('insert failed', err) }
  }

  const rows = db.prepare('SELECT id,date,steps,mood,notes FROM entries ORDER BY date DESC LIMIT 10').all()
  console.log('Inserted', inserted, 'rows; latest sample rows:')
  console.table(rows)
  db.close()
} catch (err) {
  console.error('Failed to open better-sqlite3 or write DB:', err)
  process.exit(1)
}
