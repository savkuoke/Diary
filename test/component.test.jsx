import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// mock SWR to avoid network calls in component tests
import CalendarHeader from '../components/CalendarHeader.jsx'

describe('CalendarHeader component', () => {
  it('renders header and toggles', () => {
    const months = ['2026-02', '2026-01']
    const noop = () => {}
    render(<CalendarHeader months={months} selectedMonth={months[0]} setSelectedMonth={noop} viewMode={'week'} setViewMode={noop} weeks={[]} selectedWeekStart={null} setSelectedWeekStart={noop} />)
    expect(screen.getByText('Lifestyle Diary')).toBeInTheDocument()
    // Ensure the select and nav arrows render instead of explicit Week/Month buttons
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('◀')).toBeInTheDocument()
    expect(screen.getByText('▶')).toBeInTheDocument()
  })
})
