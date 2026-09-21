import { describe, expect, it } from 'vitest'
import {
  costMarker,
  formatFailureCost,
  parseCostMarker,
} from '../../scripts/utils/failure-cost-section.js'

/** The 2026-09-20 scheduled run, in the shape summarizeLedger gives cost.json. */
const FAILED_RUN = {
  total_usd: 4.18,
  estimated: false,
  partial: false,
  retries: 2,
  calls: 10,
  byAgent: [
    { agent: 'art-director', purpose: 'first', cost_usd: 0.9 },
    { agent: 'mockup-designer', purpose: 'first', cost_usd: 0.6 },
    { agent: 'mockup-critic', purpose: 'first', cost_usd: 0.02 },
    { agent: 'mockup-designer', purpose: 'revision', cost_usd: 0.6 },
    { agent: 'mockup-critic', purpose: 'rejudge', cost_usd: 0.02 },
    { agent: 'mockup-designer', purpose: 'revision', cost_usd: 0.59 },
    { agent: 'mockup-critic', purpose: 'rejudge', cost_usd: 0.02 },
    { agent: 'react-engineer', purpose: 'first', cost_usd: 0.98 },
    { agent: 'react-engineer', purpose: 'output-patch', cost_usd: 0.3 },
    { agent: 'react-engineer', purpose: 'repair', cost_usd: 0.15 },
  ],
}

describe('formatFailureCost', () => {
  const text = formatFailureCost(FAILED_RUN, 123456)

  it('leads with the total, the call count and the retries', () => {
    expect(text.split('\n')[0]).toBe('Spend before it failed: $4.18 across 10 calls (2 retries).')
  })

  it('has a row per agent with its calls, its reasons and its dollars', () => {
    expect(text).toContain('| Agent | Calls | Why | Cost |')
    expect(text).toContain('| art-director | 1 | first | $0.90 |')
    expect(text).toContain('| mockup-designer | 3 | first, revision x2 | $1.79 |')
    expect(text).toContain('| react-engineer | 3 | first, output-patch, repair | $1.43 |')
  })

  it('ends with the marker a later run reads', () => {
    expect(parseCostMarker(text)).toEqual({
      runId: '123456',
      attempt: 1,
      total_usd: 4.18,
      calls: 10,
      estimated: false,
    })
  })

  it('says one call and one retry in the singular', () => {
    const one = formatFailureCost({ total_usd: 0.5, calls: 1, retries: 1, byAgent: [] }, 1)
    expect(one.split('\n')[0]).toBe('Spend before it failed: $0.50 across 1 call (1 retry).')
  })

  it('says what makes the total soft', () => {
    const line = formatFailureCost(
      { total_usd: 1, calls: 3, retries: 0, estimated: true, partial: true, byAgent: [] },
      1
    ).split('\n')[0]
    expect(line).toBe(
      'Spend before it failed: $1.00 across 3 calls (partly estimated, some calls unpriced).'
    )
  })

  it('reads an entry from before purposes existed as unknown, and an unpriced agent as unpriced', () => {
    const old = formatFailureCost(
      { total_usd: null, calls: 1, byAgent: [{ agent: 'art-director', cost_usd: null }] },
      1
    )
    expect(old).toContain('Spend before it failed: unpriced across 1 call.')
    expect(old).toContain('| art-director | 1 | unknown | unpriced |')
  })

  it('says a missing cost.json is unknown, never free', () => {
    const none = formatFailureCost(null, 1)
    expect(none).toMatch(/^Spend: not recorded/)
    expect(none).not.toContain('$')
    expect(parseCostMarker(none)).toBeNull()
  })
})

describe('parseCostMarker', () => {
  it('reads what costMarker wrote', () => {
    const marker = costMarker({ total_usd: 2.5, calls: 4, estimated: true }, '99')
    expect(parseCostMarker(`some issue text\n\n${marker}\n`)).toEqual({
      runId: '99',
      attempt: 1,
      total_usd: 2.5,
      calls: 4,
      estimated: true,
    })
  })

  it('keeps which attempt of the run spent it: a re-run of failed jobs keeps the run id', () => {
    expect(parseCostMarker(costMarker({ total_usd: 1, calls: 1 }, '99', 2)).attempt).toBe(2)
    expect(parseCostMarker(formatFailureCost({ total_usd: 1, calls: 1 }, '99', 3)).attempt).toBe(3)
  })

  it('reads a marker with no attempt, or a nonsense one, as the first', () => {
    expect(parseCostMarker('<!-- run-cost {"runId":"5","total_usd":1} -->').attempt).toBe(1)
    expect(parseCostMarker('<!-- run-cost {"runId":"5","attempt":"x"} -->').attempt).toBe(1)
    expect(parseCostMarker(costMarker({ total_usd: 1 }, '5', Number.NaN)).attempt).toBe(1)
  })

  it('keeps an unpriced total as null', () => {
    expect(parseCostMarker(costMarker({ total_usd: null, calls: 2 }, '5')).total_usd).toBeNull()
  })

  it.each([
    ['an issue from before the marker', 'The daily redesign pipeline failed.'],
    ['an empty body', ''],
    ['no body', undefined],
    ['a marker that is not JSON', '<!-- run-cost {nope} -->'],
    ['a marker with no run id', '<!-- run-cost {"total_usd":1} -->'],
  ])('reads %s as no attempt', (_name, body) => {
    expect(parseCostMarker(body)).toBeNull()
  })

  it('ignores a number where a run id should be, so a hand-edited body cannot inject one', () => {
    expect(parseCostMarker('<!-- run-cost {"runId":7,"total_usd":1} -->')).toBeNull()
  })
})
