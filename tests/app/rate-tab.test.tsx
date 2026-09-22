// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'

vi.mock('../../app/components/panel/api', () => ({
  submitRating: vi.fn().mockResolvedValue({ ok: true, issueUrl: 'https://github.com/x/82' }),
}))

import { submitRating } from '../../app/components/panel/api'
import { RateTab } from '../../app/components/panel/RateTab'

const unrated = [
  { number: 82, date: '2026-07-20', title: 'Rate: 2026-07-20 — "Breadboard"', url: 'u' },
  { number: 81, date: '2026-07-19', title: 'Rate: 2026-07-19 — "Fluoro"', url: 'u' },
]

describe('RateTab', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(cleanup)

  it('submits the selected grade and notes for the newest unrated day', async () => {
    render(<RateTab unrated={unrated} onRated={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.change(screen.getByLabelText(/worked/i), { target: { value: 'amber drench' } })
    fireEvent.click(screen.getByRole('button', { name: /submit rating/i }))
    await waitFor(() =>
      expect(submitRating).toHaveBeenCalledWith({
        date: '2026-07-20',
        grade: 'B',
        worked: 'amber drench',
        didnt: '',
        try: '',
      })
    )
  })

  it('disables submit until a grade is chosen', () => {
    render(<RateTab unrated={unrated} onRated={() => {}} />)
    expect(
      (screen.getByRole('button', { name: /submit rating/i }) as HTMLButtonElement).disabled
    ).toBe(true)
  })

  it('clears the form and moves to the next day after a save, so a second click cannot duplicate (#330)', async () => {
    const { rerender } = render(<RateTab unrated={unrated} onRated={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.change(screen.getByLabelText(/worked/i), { target: { value: 'amber drench' } })
    fireEvent.click(screen.getByRole('button', { name: /submit rating/i }))
    await waitFor(() => expect(screen.getByText(/view issue/i)).toBeTruthy())
    // onRated refetches status and the rated day drops out of the list.
    rerender(<RateTab unrated={unrated.slice(1)} onRated={() => {}} />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('2026-07-19')
    expect((screen.getByLabelText(/worked/i) as HTMLTextAreaElement).value).toBe('')
    expect(
      (screen.getByRole('button', { name: /submit rating/i }) as HTMLButtonElement).disabled
    ).toBe(true)
    expect(submitRating).toHaveBeenCalledTimes(1)
  })

  it('keeps the saved link when the last unrated day was just rated', async () => {
    const { rerender } = render(<RateTab unrated={unrated.slice(0, 1)} onRated={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: 'A' }))
    fireEvent.click(screen.getByRole('button', { name: /submit rating/i }))
    await waitFor(() => expect(screen.getByText(/view issue/i)).toBeTruthy())
    rerender(<RateTab unrated={[]} onRated={() => {}} />)
    expect(screen.getByText(/nothing waiting/i)).toBeTruthy()
    expect(screen.getByText(/view issue/i)).toBeTruthy()
  })

  it('lists older unrated days', () => {
    render(<RateTab unrated={unrated} onRated={() => {}} />)
    expect(screen.getByText(/2026-07-19/)).toBeTruthy()
  })
})
