import { readData, writeData } from '../../lib/storage'

const DATA_PATH = 'data/diary.json'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const entries = await readData(DATA_PATH)
    return res.status(200).json(entries)
  }

  if (req.method === 'POST') {
    const entries = await readData(DATA_PATH)
    const id = Date.now().toString()
    const entry = { id, ...req.body }
    entries.unshift(entry)
    await writeData(DATA_PATH, entries)
    return res.status(201).json(entry)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing id' })
    let entries = await readData(DATA_PATH)
    const idx = entries.findIndex(e => e.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    const updated = { ...entries[idx], ...req.body }
    entries[idx] = updated
    await writeData(DATA_PATH, entries)
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    let entries = await readData(DATA_PATH)
    entries = entries.filter(e => e.id !== id)
    await writeData(DATA_PATH, entries)
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET,POST,DELETE')
  res.status(405).end('Method Not Allowed')
}
