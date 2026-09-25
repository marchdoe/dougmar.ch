// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GolfCard } from '../../app/dev/cards/GolfCard'
import type { Signals } from '../../app/dev/api'

/**
 * Two golf leaders with the same name broke the dev-panel E2E job on
 * 2026-09-25: ESPN sent two competitors with no `athlete.displayName`, both
 * of which the collector used to fall back to the shared literal 'Unknown',
 * and that reached the dev panel's `<GolfCard>` as React's "two children
 * with the same key" console error — exactly what
 * tests/e2e/dev-panel.spec.ts's "loads without console errors" asserts never
 * happens. The collector fallback is now unique (golf.test.js), but the
 * card's key must not repeat data blindly either: this renders
 * duplicate-name leaders straight through and checks React stays quiet.
 */
describe('GolfCard', () => {
  afterEach(cleanup)

  it('renders duplicate-named leaders without a duplicate-key console error', () => {
    const errors: unknown[] = []
    const spy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      errors.push(args)
    })

    const signals = {
      golf: {
        tournament: 'Fixture Open',
        status: 'In Progress',
        leaders: [
          { name: 'Unknown', position: '2', score: 'E' },
          { name: 'Unknown', position: '3', score: 'E' },
        ],
      },
    } as unknown as Signals

    render(<GolfCard signals={signals} />)

    const keyWarning = errors.find((call) => String((call as unknown[])[0]).includes('same key'))
    expect(keyWarning).toBeUndefined()

    spy.mockRestore()
  })
})
