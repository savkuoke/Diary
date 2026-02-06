import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// mock SWR to avoid network calls in component tests
vi.mock('swr', () => ({
  default: () => ({ data: [{ id: '1', date: '2026-02-02', weight: '70', steps: '5000', mood: 'ok', notes: 'x' }], mutate: vi.fn() })
}))

import Home from '../pages/index'

describe('Home component', () => {
  it('renders header and toggles', () => {
    render(<Home />)
    expect(screen.getByText('Lifestyle Diary')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })
})
