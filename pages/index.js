import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data: entries = [], mutate } = useSWR('/api/entries', fetcher)
  const [form, setForm] = useState({ date: '', weight: '', steps: '', mood: '', notes: '' })

  async function addEntry(e) {
    e.preventDefault()
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ date: '', weight: '', steps: '', mood: '', notes: '' })
      mutate()
    }
  }

  async function deleteEntry(id) {
    const res = await fetch(`/api/entries?id=${id}`, { method: 'DELETE' })
    if (res.ok) mutate()
  }

  return (
    <div className="container">
      <h1>Lifestyle Diary</h1>
      <form onSubmit={addEntry} className="entry-form">
        <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} required />
        <input type="number" placeholder="weight (kg)" value={form.weight} onChange={(e)=>setForm({...form, weight:e.target.value})} />
        <input type="number" placeholder="steps" value={form.steps} onChange={(e)=>setForm({...form, steps:e.target.value})} />
        <input type="text" placeholder="mood" value={form.mood} onChange={(e)=>setForm({...form, mood:e.target.value})} />
        <textarea placeholder="notes" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
        <button type="submit">Add</button>
      </form>

      <ul className="entries">
        {entries.map((entry) => (
          <li key={entry.id} className="entry">
            <div><strong>{entry.date}</strong> — {entry.mood}</div>
            <div>Weight: {entry.weight} kg • Steps: {entry.steps}</div>
            <div>{entry.notes}</div>
            <button onClick={()=>deleteEntry(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
