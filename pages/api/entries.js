import { getAllEntries, createEntry, updateEntry, deleteEntry } from '../../lib/db'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const entries = getAllEntries()
      return res.status(200).json(entries)
    }

    if (req.method === 'POST') {
      const entry = createEntry(req.body)
      return res.status(201).json(entry)
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Missing id' })
      const updated = updateEntry(id, req.body)
      return res.status(200).json(updated)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      deleteEntry(id)
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE')
    res.status(405).end('Method Not Allowed')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
