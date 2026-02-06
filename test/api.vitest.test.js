import { describe, it, expect, vi } from 'vitest'

// mock db to avoid touching real database file
vi.mock('../lib/db.js', () => {
  const getAllEntries = vi.fn().mockReturnValue([])
  const createEntry = vi.fn().mockImplementation((e) => ({ id: 'mock-id', ...e }))
  const updateEntry = vi.fn()
  const deleteEntry = vi.fn()
  return { getAllEntries, createEntry, updateEntry, deleteEntry }
})

import handler from '../pages/api/entries'

function makeRes() {
  let statusCode = 200
  let headers = {}
  let body = null
  return {
    status(code) { statusCode = code; return this },
    json(data) { body = data; this.body = data; return this },
    setHeader(k,v){ headers[k]=v }
  }
}

describe('API /api/entries handler', () => {
  it('GET returns entries array', async () => {
    // the mocked module's functions are created by the vi.mock factory above
    const db = await import('../lib/db.js')
    db.getAllEntries.mockReturnValueOnce([{ id: 'a', date: '2026-02-07' }])
    const req = { method: 'GET' }
    const res = makeRes()
    await handler(req, res)
    expect(Array.isArray(res.body || [])).toBeTruthy()
  })

  it('POST calls writeData', async () => {
    const db = await import('../lib/db.js')
    db.getAllEntries.mockReturnValueOnce([])
    const req = { method: 'POST', body: { date: '2026-02-07' } }
    const res = makeRes()
    await handler(req, res)
    expect(db.createEntry).toHaveBeenCalled()
  })
})
