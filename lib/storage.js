import fs from 'fs'
import path from 'path'

export async function readData(relPath) {
  const p = path.join(process.cwd(), relPath)
  try {
    const raw = await fs.promises.readFile(p, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

export async function writeData(relPath, data) {
  const p = path.join(process.cwd(), relPath)
  await fs.promises.mkdir(path.dirname(p), { recursive: true })
  await fs.promises.writeFile(p, JSON.stringify(data, null, 2), 'utf8')
}
