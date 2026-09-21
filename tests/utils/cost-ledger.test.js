import { describe, it, expect, beforeEach } from 'vitest'
import {
  PURPOSES,
  resetLedger,
  recordUsage,
  noteRetry,
  getUsageRecords,
  summarizeLedger,
  estimateCostUsd,
} from '../../scripts/utils/cost-ledger.js'
import { pricingFor } from '../../scripts/utils/models.js'
import { extractResultUsage } from '../../scripts/utils/claude-cli.js'

beforeEach(() => {
  resetLedger()
})

describe('estimateCostUsd', () => {
  it('prices input and output at the model rate', () => {
    // 1M in + 1M out on Sonnet 5 = $3 + $15
    const cost = estimateCostUsd('claude-sonnet-5', {
      input_tokens: 1_000_000,
      output_tokens: 1_000_000,
    })
    expect(cost).toBeCloseTo(18, 6)
  })

  it('discounts cache reads and surcharges cache writes', () => {
    const rate = pricingFor('claude-haiku-4-5').input
    expect(estimateCostUsd('claude-haiku-4-5', { cache_read_input_tokens: 1_000_000 })).toBeCloseTo(
      rate * 0.1,
      6
    )
    expect(
      estimateCostUsd('claude-haiku-4-5', { cache_creation_input_tokens: 1_000_000 })
    ).toBeCloseTo(rate * 1.25, 6)
  })

  it('returns null for an unknown model rather than zero', () => {
    expect(estimateCostUsd('claude-from-the-future', { input_tokens: 1000 })).toBeNull()
  })

  it('treats missing usage fields as zero', () => {
    expect(estimateCostUsd('claude-opus-4-8', {})).toBe(0)
  })
})

describe('recordUsage', () => {
  it('prefers a reported cost over an estimate', () => {
    const rec = recordUsage({
      agent: 'art-director',
      model: 'claude-sonnet-5',
      costUsd: 0.42,
      usage: { input_tokens: 1_000_000, output_tokens: 1_000_000 },
    })
    expect(rec.cost_usd).toBe(0.42)
    expect(rec.estimated).toBe(false)
  })

  it('estimates and flags when no cost is reported', () => {
    const rec = recordUsage({
      agent: 'mockup-critic',
      model: 'claude-haiku-4-5',
      source: 'sdk',
      usage: { input_tokens: 1_000_000, output_tokens: 0 },
    })
    expect(rec.cost_usd).toBeCloseTo(1, 6)
    expect(rec.estimated).toBe(true)
    expect(rec.source).toBe('sdk')
  })

  it('prices a call with no usage at all as unpriceable, not free', () => {
    // A crashed CLI call (non-zero exit, no result event) hits this path.
    // Pricing it as $0 would read as "this call was free" and vanish from
    // the run's total instead of flagging the gap.
    const rec = recordUsage({ agent: 'react-engineer', model: 'claude-sonnet-5' })
    expect(rec.cost_usd).toBeNull()
    expect(rec.estimated).toBe(false)
    expect(rec.input).toBeNull()
    expect(rec.output).toBeNull()
    expect(getUsageRecords()).toHaveLength(1)
  })

  it('does not estimate from cache tokens alone — a stalled call can log cache activity with no completion', () => {
    const rec = recordUsage({
      agent: 'art-director',
      model: 'claude-opus-4-8',
      usage: { cache_read_input_tokens: 50_000, input_tokens: 0, output_tokens: 0 },
    })
    expect(rec.cost_usd).toBeNull()
  })

  it('coerces a non-object usage and a missing agent', () => {
    const rec = recordUsage({ usage: 'not-an-object' })
    expect(rec.agent).toBe('unknown')
    expect(rec.model).toBeNull()
    expect(rec.cost_usd).toBeNull()
  })

  // #578: the ledger could not say why a call was made; whether the second
  // engineer entry was a retry, a patch, a revision or a repair had to be
  // read off the call order.
  it.each(PURPOSES)('records the purpose %s', (purpose) => {
    const rec = recordUsage({ agent: 'react-engineer', model: 'claude-sonnet-5', purpose })
    expect(rec.purpose).toBe(purpose)
    expect(getUsageRecords()[0].purpose).toBe(purpose)
    expect(summarizeLedger().byAgent[0].purpose).toBe(purpose)
  })

  it('says unknown for a caller that gave no purpose, so old callers do not break', () => {
    expect(recordUsage({ agent: 'a', model: 'claude-sonnet-5' }).purpose).toBe('unknown')
  })

  it('says unknown for a purpose it does not know, rather than storing a typo', () => {
    expect(recordUsage({ agent: 'a', purpose: 'repiar' }).purpose).toBe('unknown')
    expect(recordUsage({ agent: 'a', purpose: 3 }).purpose).toBe('unknown')
  })
})

describe('summarizeLedger', () => {
  it('is empty and unpriced before anything is recorded', () => {
    const s = summarizeLedger()
    expect(s.total_usd).toBeNull()
    expect(s.calls).toBe(0)
    expect(s.retries).toBe(0)
    expect(s.byAgent).toEqual([])
  })

  it('sums reported and estimated costs and flags both', () => {
    recordUsage({ agent: 'art-director', model: 'claude-opus-4-8', costUsd: 0.5 })
    recordUsage({
      agent: 'mockup-critic',
      model: 'claude-haiku-4-5',
      source: 'sdk',
      usage: { output_tokens: 200_000 },
    })
    const s = summarizeLedger()
    expect(s.total_usd).toBeCloseTo(1.5, 6) // 0.5 + (200k out × $5/M)
    expect(s.estimated).toBe(true)
    expect(s.partial).toBe(false)
    expect(s.calls).toBe(2)
  })

  it('marks the total partial when a call could not be priced', () => {
    recordUsage({ agent: 'art-director', model: 'claude-opus-4-8', costUsd: 1 })
    recordUsage({ agent: 'mystery', model: 'claude-from-the-future' })
    const s = summarizeLedger()
    expect(s.total_usd).toBe(1)
    expect(s.partial).toBe(true)
    expect(s.calls).toBe(2)
  })

  it('counts retries', () => {
    noteRetry()
    noteRetry()
    expect(summarizeLedger().retries).toBe(2)
  })

  it('resetLedger clears records and retries', () => {
    recordUsage({ agent: 'a', model: 'claude-sonnet-5', costUsd: 1 })
    noteRetry()
    resetLedger()
    const s = summarizeLedger()
    expect(s.calls).toBe(0)
    expect(s.retries).toBe(0)
  })

  it('returns copies, so callers cannot mutate the ledger', () => {
    recordUsage({ agent: 'a', model: 'claude-sonnet-5', costUsd: 1 })
    getUsageRecords()[0].cost_usd = 999
    summarizeLedger().byAgent[0].cost_usd = 999
    expect(summarizeLedger().total_usd).toBe(1)
  })
})

describe('extractResultUsage', () => {
  it('pulls cost, usage, duration and turns from a result event', () => {
    const got = extractResultUsage({
      type: 'result',
      result: 'text',
      total_cost_usd: 0.1234,
      usage: { input_tokens: 10, output_tokens: 20 },
      duration_ms: 5000,
      num_turns: 1,
    })
    expect(got).toEqual({
      costUsd: 0.1234,
      usage: { input_tokens: 10, output_tokens: 20 },
      ms: 5000,
      numTurns: 1,
    })
  })

  it('degrades to nulls on an older CLI pin that omits the fields', () => {
    const got = extractResultUsage({ type: 'result', result: 'text' })
    expect(got).toEqual({ costUsd: null, usage: {}, ms: null, numTurns: null })
  })

  it('rejects non-finite numbers rather than passing NaN through', () => {
    const got = extractResultUsage({ total_cost_usd: NaN, duration_ms: 'soon', usage: null })
    expect(got.costUsd).toBeNull()
    expect(got.ms).toBeNull()
    expect(got.usage).toEqual({})
  })

  it('handles being called with nothing', () => {
    expect(() => extractResultUsage()).not.toThrow()
  })
})
