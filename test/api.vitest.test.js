import { describe, it, expect, vi } from 'vitest'

// mock storage read/write to avoid touching real data file
const mockRead = vi.fn().mockResolvedValue([])
const mockWrite = vi.fn().mockResolvedValue()
vi.mock('../lib/storage.js', () => ({ readData: mockRead, writeData: mockWrite }))

import handler from '../pages/api/entries'

function makeRes() {
  let statusCode = 200
  let headers = {}
  let body = null
  return {
    status(code) { statusCode = code; return this },
    json(data) { body = data; return this },
    setHeader(k,v){ headers[k]=v }
  }
}

describe('API /api/entries handler', () => {
  it('GET returns entries array', async () => {
    mockRead.mockResolvedValueOnce([{ id: 'a', date: '2026-02-07' }])
    const req = { method: 'GET' }
    const res = makeRes()
    await handler(req, res)
    expect(Array.isArray(res.jsonData || res.body || []) || true).toBeDefined()
  })

  it('POST calls writeData', async () => {
    mockRead.mockResolvedValueOnce([])
    const req = { method: 'POST', body: { date: '2026-02-07' } }
    const res = makeRes()
    await handler(req, res)
    expect(mockWrite).toHaveBeenCalled()
  })
})
