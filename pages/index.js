import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import CalendarHeader from '../components/CalendarHeader.jsx'

const fetcher = (url) => fetch(url).then((r) => r.json())
import { formatMonthKey, monthLabel, startOfWeek, addDays, weekLabel } from '../lib/utils.js'

export default function Home() {
  const { data: entries = [], mutate } = useSWR('/api/entries', fetcher)

  // Form state
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

  // derive months from entries
  const months = useMemo(() => {
    const set = new Set()
    entries.forEach((e) => {
      try {
        const d = new Date(e.date)
        if (!isNaN(d)) set.add(formatMonthKey(d))
      } catch (err) {}
    })
    // always include current month
    set.add(formatMonthKey(new Date()))
    return Array.from(set).sort().reverse()
  }, [entries])

  const [selectedMonth, setSelectedMonth] = useState(() => (typeof window !== 'undefined' ? (months[0] || formatMonthKey(new Date())) : formatMonthKey(new Date())))
  useEffect(() => { if (months.length && !months.includes(selectedMonth)) setSelectedMonth(months[0]) }, [months])

  // compute weeks for the selected month
  const weeks = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number)
    const month = m - 1
    const first = new Date(y, month, 1)
    const last = new Date(y, month + 1, 0)

    let start = startOfWeek(first)
    const out = []
    while (start <= last) {
      out.push(new Date(start))
      start = addDays(start, 7)
    }
    return out
  }, [selectedMonth])

  const [selectedWeekStart, setSelectedWeekStart] = useState(null)
  useEffect(() => { if (weeks.length) setSelectedWeekStart(weeks[0]) }, [weeks])

  // group entries by week start
  const entriesByWeek = useMemo(() => {
    const map = new Map()
    entries.forEach((e) => {
      const d = new Date(e.date)
      if (isNaN(d)) return
      const wk = startOfWeek(d).toISOString()
      if (!map.has(wk)) map.set(wk, [])
      map.get(wk).push(e)
    })
    return map
  }, [entries])

  // map entries by date key YYYY-MM-DD for month grid markers
  const entriesByDate = useMemo(() => {
    const map = new Map()
    entries.forEach(e => {
      const d = new Date(e.date)
      if (isNaN(d)) return
      const key = d.toISOString().slice(0,10)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    })
    return map
  }, [entries])

  const [viewMode, setViewMode] = useState('week') // 'week' or 'month'

  return (
    <div className="container">
      {/* header moved to a separate component to keep JSX in .jsx for Vitest */}
      <CalendarHeader
        months={months.map(m=>m)}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        viewMode={viewMode}
        setViewMode={setViewMode}
        weeks={weeks}
        selectedWeekStart={selectedWeekStart}
        setSelectedWeekStart={setSelectedWeekStart}
      />

      <main className="main-grid">
        <section className="left">
          <form onSubmit={addEntry} className="entry-form card">
            <h2>Add entry</h2>
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} required />
            <input type="number" placeholder="weight (kg)" value={form.weight} onChange={(e)=>setForm({...form, weight:e.target.value})} />
            <input type="number" placeholder="steps" value={form.steps} onChange={(e)=>setForm({...form, steps:e.target.value})} />
            <input type="text" placeholder="mood" value={form.mood} onChange={(e)=>setForm({...form, mood:e.target.value})} />
            <textarea placeholder="notes" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
            <div style={{display:'flex', gap:8}}>
              <button className="btn primary" type="submit">Add</button>
            </div>
          </form>
        </section>

        <section className="right">
          <h2>{viewMode === 'week' ? 'Week markings' : 'Month view'}</h2>
          {viewMode === 'week' ? (
            <div className="entries-grid">
              {selectedWeekStart ? (
                (entriesByWeek.get(selectedWeekStart.toISOString()) || []).length ? (
                  (entriesByWeek.get(selectedWeekStart.toISOString()) || []).map(entry => (
                    <article key={entry.id} className="entry-card card">
                      <div className="entry-header">
                        <strong>{entry.date}</strong>
                        <button className="btn tiny" onClick={()=>deleteEntry(entry.id)}>Delete</button>
                      </div>
                      <div className="entry-body">
                        <div className="stat">Weight: <strong>{entry.weight || '—'}</strong> kg</div>
                        <div className="stat">Steps: <strong>{entry.steps || '—'}</strong></div>
                        <div className="stat">Mood: <em>{entry.mood || '—'}</em></div>
                        <p className="notes">{entry.notes}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="card empty">No entries for this week</div>
                )
              ) : (
                <div className="card empty">Select a week</div>
              )}
            </div>
          ) : (
            <div className="card month-card">
              <div className="month-grid">
                <div className="weekday-headers">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="weekday">{d}</div>)}
                </div>
                <div className="days-grid">
                  {(() => {
                    const [y, m] = selectedMonth.split('-').map(Number)
                    const first = new Date(y, m - 1, 1)
                    const last = new Date(y, m, 0)
                    let start = startOfWeek(first)
                    const cells = []
                    while (start <= addDays(last, 6)) {
                      const key = start.toISOString().slice(0,10)
                      const inMonth = start.getMonth() === (m - 1)
                      const entriesForDay = entriesByDate.get(key) || []
                      cells.push(
                        <div key={key} className={"day-cell" + (inMonth ? '' : ' muted') } onClick={()=>{ setSelectedWeekStart(startOfWeek(start)); setViewMode('week') }}>
                          <div className="day-number">{start.getDate()}</div>
                          <div className="markers">
                            {entriesForDay.slice(0,3).map((en, i) => <span key={i} className="marker" title={en.notes || en.mood}></span>)}
                            {entriesForDay.length > 3 && <span className="more">+{entriesForDay.length - 3}</span>}
                          </div>
                        </div>
                      )
                      start = addDays(start,1)
                    }
                    return cells
                  })()}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
