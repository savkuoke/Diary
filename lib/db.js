import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

let impl = null

try {
  // try to load native better-sqlite3; this will fail in browser-like test bundlers
  const Database = require('better-sqlite3')
  const dbPath = path.join(process.cwd(), 'data', 'diary.db')
  const db = new Database(dbPath)

  // initialize table
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

  impl = {
    getAllEntries() {
      return db.prepare('SELECT * FROM entries ORDER BY date DESC').all()
    },
    createEntry(entry) {
      const id = entry.id || Date.now().toString()
      const stmt = db.prepare('INSERT INTO entries (id, date, weight, steps, mood, notes) VALUES (@id, @date, @weight, @steps, @mood, @notes)')
      stmt.run({ id, date: entry.date, weight: entry.weight || '', steps: entry.steps ? Number(entry.steps) : null, mood: entry.mood || '', notes: entry.notes || '' })
      return { id, ...entry }
    },
    updateEntry(id, data) {
      const stmt = db.prepare('UPDATE entries SET date = @date, weight = @weight, steps = @steps, mood = @mood, notes = @notes WHERE id = @id')
      stmt.run({ id, date: data.date, weight: data.weight || '', steps: data.steps ? Number(data.steps) : null, mood: data.mood || '', notes: data.notes || '' })
      return db.prepare('SELECT * FROM entries WHERE id = ?').get(id)
    },
    deleteEntry(id) {
      return db.prepare('DELETE FROM entries WHERE id = ?').run(id)
    }
  }
} catch (err) {
  // fallback in-memory implementation (used during tests/bundling)
  const entries = []
  impl = {
    getAllEntries() {
      return [...entries]
    },
    createEntry(entry) {
      const id = entry.id || Date.now().toString()
      const e = { id, ...entry }
      entries.unshift(e)
      return e
    },
    updateEntry(id, data) {
      const idx = entries.findIndex(e => e.id === id)
      if (idx === -1) return null
      entries[idx] = { ...entries[idx], ...data }
      return entries[idx]
    },
    deleteEntry(id) {
      const idx = entries.findIndex(e => e.id === id)
      if (idx === -1) return { changes: 0 }
      entries.splice(idx, 1)
      return { changes: 1 }
    }
  }
}

export const getAllEntries = impl.getAllEntries
export const createEntry = impl.createEntry
export const updateEntry = impl.updateEntry
export const deleteEntry = impl.deleteEntry
