import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import CalendarHeader from '../components/CalendarHeader.jsx'

describe('CalendarHeader interactions', () => {
  it('calls setSelectedMonth when navigation buttons are clicked', () => {
    const months = ['2026-12', '2026-11', '2026-10']
    const setSelectedMonth = vi.fn()
    const noop = () => {}

    render(
      <CalendarHeader
        months={months}
        selectedMonth={months[1]}
        setSelectedMonth={setSelectedMonth}
        viewMode={'week'}
        setViewMode={noop}
        weeks={[]}
        selectedWeekStart={null}
        setSelectedWeekStart={noop}
      />
    )

    // left arrow (◀) should move to the next index (months[2])
    const left = screen.getByText('◀')
    fireEvent.click(left)
    expect(setSelectedMonth).toHaveBeenCalledWith(months[2])

    setSelectedMonth.mockClear()

    // right arrow (▶) should move to the previous index (months[0])
    const right = screen.getByText('▶')
    fireEvent.click(right)
    expect(setSelectedMonth).toHaveBeenCalledWith(months[0])
  })

  it('calls setSelectedMonth when the select value changes', () => {
    const months = ['2026-12', '2026-11', '2026-10']
    const setSelectedMonth = vi.fn()
    const noop = () => {}

    render(
      <CalendarHeader
        months={months}
        selectedMonth={months[0]}
        setSelectedMonth={setSelectedMonth}
        viewMode={'month'}
        setViewMode={noop}
        weeks={[]}
        selectedWeekStart={null}
        setSelectedWeekStart={noop}
      />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: months[2] } })
    expect(setSelectedMonth).toHaveBeenCalledWith(months[2])
  })
})
