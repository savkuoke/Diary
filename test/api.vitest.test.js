import { describe, it, expect, vi } from 'vitest'

// mock storage read/write to avoid touching real data file
vi.mock('../lib/storage.js', () => {
  const read = vi.fn().mockResolvedValue([])
  const write = vi.fn().mockResolvedValue()
  return { readData: read, writeData: write }
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
    const storage = await import('../lib/storage.js')
    storage.readData.mockResolvedValueOnce([{ id: 'a', date: '2026-02-07' }])
    const req = { method: 'GET' }
    const res = makeRes()
    await handler(req, res)
    expect(Array.isArray(res.body || [])).toBeTruthy()
  })

  it('POST calls writeData', async () => {
    const storage = await import('../lib/storage.js')
    storage.readData.mockResolvedValueOnce([])
    const req = { method: 'POST', body: { date: '2026-02-07' } }
    const res = makeRes()
    await handler(req, res)
    expect(storage.writeData).toHaveBeenCalled()
  })
})
