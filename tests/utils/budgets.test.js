import { describe, it, expect } from 'vitest'
import {
  AGENT_BUDGETS,
  DEFAULT_AGENT_BUDGET,
  STEP_BUDGETS,
  budgetFor,
} from '../../scripts/utils/budgets.js'
import { PROD_MODELS } from '../../scripts/utils/models.js'

describe('AGENT_BUDGETS', () => {
  it('has an entry for every agent the pipeline runs', () => {
    for (const agent of Object.keys(PROD_MODELS)) {
      expect(AGENT_BUDGETS, `${agent} has no budget`).toHaveProperty(agent)
    }
  })

  it('keeps every stall window inside its hard timeout, or the stall check can never fire', () => {
    // claude-cli.js once defaulted stall to 900000 against a 600000 timeout,
    // which made the stall check unreachable for every caller that did not
    // override it.
    for (const [agent, b] of Object.entries({ ...AGENT_BUDGETS, default: DEFAULT_AGENT_BUDGET })) {
      expect(
        b.stallTimeoutMs,
        `${agent}: stall ${b.stallTimeoutMs} >= timeout ${b.timeoutMs}`
      ).toBeLessThan(b.timeoutMs)
    }
  })

  it('falls back to the default for an unknown agent', () => {
    expect(budgetFor('not-an-agent')).toBe(DEFAULT_AGENT_BUDGET)
  })

  it('preserves the values each call site carried before they were gathered', () => {
    expect(budgetFor('art-director')).toEqual({ timeoutMs: 1_500_000, stallTimeoutMs: 480_000 })
    expect(budgetFor('mockup-designer')).toEqual({ timeoutMs: 1_800_000, stallTimeoutMs: 480_000 })
    expect(budgetFor('react-engineer')).toEqual({ timeoutMs: 1_800_000, stallTimeoutMs: 480_000 })
    expect(budgetFor('spec-critic')).toEqual({ timeoutMs: 600_000, stallTimeoutMs: 300_000 })
  })

  // #486: the two vision critics carry a lower output cap than the SDK
  // default (16000), so a runaway reply fails fast instead of eating the
  // whole cap on prose the capped prompt format no longer asks for.
  // react-engineer, the only other agent that reaches callVisionAgent's
  // sibling paths, is deliberately left without this key.
  it('caps the vision critics output below the SDK default, and leaves the engineer alone', () => {
    expect(budgetFor('mockup-critic')).toEqual({
      timeoutMs: 600_000,
      stallTimeoutMs: 300_000,
      maxTokens: 6000,
    })
    expect(budgetFor('screenshot-critic')).toEqual({
      timeoutMs: 600_000,
      stallTimeoutMs: 300_000,
      maxTokens: 6000,
    })
    expect(budgetFor('react-engineer')).not.toHaveProperty('maxTokens')
  })
})

describe('STEP_BUDGETS', () => {
  it('are all positive milliseconds', () => {
    for (const [k, v] of Object.entries(STEP_BUDGETS)) {
      expect(Number.isInteger(v) && v > 0, `${k}=${v}`).toBe(true)
    }
  })
})
