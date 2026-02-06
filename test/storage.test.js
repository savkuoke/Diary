import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import { readData, writeData } from '../lib/storage.js'

const TMP = 'test/tmp-diary.json'

test('writeData and readData roundtrip', async () => {
  try { await fs.promises.unlink(TMP) } catch (e) {}
  const payload = [{ id: 't1', date: '2026-02-07', notes: 'hello' }]
  await writeData(TMP, payload)
  const read = await readData(TMP)
  assert.strictEqual(Array.isArray(read), true)
  assert.strictEqual(read[0].id, 't1')
  // cleanup
  await fs.promises.unlink(TMP)
})
