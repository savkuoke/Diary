#!/usr/bin/env node
// Migration script: copy data/diary.json to a timestamped backup, then insert entries into SQLite via lib/db.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dataPath = path.join(root, 'data', 'diary.json')
const backupPath = path.join(root, 'data', `diary.json.bak.${Date.now()}`)

async function main() {
  if (!fs.existsSync(dataPath)) {
    console.error('No diary.json found at', dataPath)
    process.exit(1)
  }

  const raw = fs.readFileSync(dataPath, 'utf8')
  let payload
  try {
    payload = JSON.parse(raw)
  } catch (err) {
    console.error('Failed to parse diary.json:', err)
    process.exit(1)
  }

  // payload might be an array or an object with `entries` key
  const entries = Array.isArray(payload) ? payload : (payload.entries || [])

  if (!entries.length) {
    console.log('No entries found in diary.json — nothing to migrate.')
    process.exit(0)
  }

  // Backup original file
  fs.copyFileSync(dataPath, backupPath)
  console.log('Backup written to', backupPath)

  // Import DB helper. Use the same API as the app (`createEntry`).
  // lib path relative to project root
  const dbModulePath = path.join(root, 'lib', 'db.js')
  let db
  try {
    db = await import(dbModulePath)
  } catch (err) {
    console.error('Failed to import lib/db.js:', err)
    process.exit(1)
  }

  if (typeof db.createEntry !== 'function') {
    console.error('lib/db.js does not export createEntry — cannot continue')
    process.exit(1)
  }

  let inserted = 0
  for (const e of entries) {
    // Normalize fields expected by the DB helper
    const row = {
      id: e.id,
      date: e.date,
      weight: e.weight ?? '',
      steps: e.steps ?? null,
      mood: e.mood ?? '',
      notes: e.notes ?? ''
    }

    try {
      // createEntry is synchronous in the current db implementation, but handle promises just in case
      const res = db.createEntry(row)
      if (res && typeof res.then === 'function') await res
      inserted++
    } catch (err) {
      console.error('Failed to insert entry', e.id || e.date, err)
    }
  }

  console.log(`Migration complete: inserted ${inserted} entries.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
