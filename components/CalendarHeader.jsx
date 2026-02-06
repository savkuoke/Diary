import React from 'react'

export default function CalendarHeader({ months, selectedMonth, setSelectedMonth, viewMode, setViewMode, weeks, selectedWeekStart, setSelectedWeekStart }){
  return (
    <header className="header">
      <h1>Lifestyle Diary</h1>
      <div className="selectors">
        <div className="month-nav">
          <button onClick={() => {
            const idx = months.indexOf(selectedMonth)
            if (idx < months.length - 1) setSelectedMonth(months[idx + 1])
          }}>{'◀'}</button>
          <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={() => {
            const idx = months.indexOf(selectedMonth)
            if (idx > 0) setSelectedMonth(months[idx - 1])
          }}>{'▶'}</button>
        </div>

        {/* quick-jump buttons removed per user request */}

        <div className="week-list" style={{alignItems:'center'}}>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button className={viewMode==='week'?'btn tiny primary':'btn tiny'} onClick={()=>setViewMode('week')}>Week</button>
              <button className={viewMode==='month'?'btn tiny primary':'btn tiny'} onClick={()=>setViewMode('month')}>Month</button>
            </div>
            {viewMode === 'week' && (
              <div style={{display:'flex', gap:8, overflow:'auto'}}>
                {weeks.map(w => (
                  <button key={w.toISOString()} className={selectedWeekStart && selectedWeekStart.toISOString() === w.toISOString() ? 'week active' : 'week'} onClick={()=>setSelectedWeekStart(w)}>
                    {w.toLocaleDateString()}
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>
    </header>
  )
}
