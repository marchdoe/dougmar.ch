import { describe, it, expect, afterEach } from 'vitest'
import {
  modelFor,
  isDevModelTier,
  PROD_MODELS,
  MODEL_IDS,
  MODEL_CATALOG,
  pricingFor,
  supportsAdaptiveThinking,
} from '../../scripts/utils/models.js'

const ENV_KEYS = ['PIPELINE_TIER', 'ANTHROPIC_API_KEY']
const saved = {}
function setEnv(patch) {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k]
    delete process.env[k]
  }
  Object.assign(process.env, patch)
}
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k]
    else process.env[k] = saved[k]
  }
})

describe('model tier resolution', () => {
  it('defaults to DEV when no API key is present (local Max-plan run)', () => {
    setEnv({})
    expect(isDevModelTier()).toBe(true)
    expect(modelFor('mockup-designer')).toBe(MODEL_IDS.sonnet) // capped down from opus
  })

  it('defaults to PROD when an API key is present (CI / billed run)', () => {
    setEnv({ ANTHROPIC_API_KEY: 'sk-ant-test' })
    expect(isDevModelTier()).toBe(false)
    expect(modelFor('mockup-designer')).toBe(MODEL_IDS.opus) // full prod model
  })

  it('PIPELINE_TIER=prod forces prod models even with no API key', () => {
    setEnv({ PIPELINE_TIER: 'prod' })
    expect(modelFor('mockup-designer')).toBe(MODEL_IDS.opus)
  })

  it('PIPELINE_TIER=dev forces dev cap even with an API key', () => {
    setEnv({ PIPELINE_TIER: 'dev', ANTHROPIC_API_KEY: 'sk-ant-test' })
    expect(modelFor('mockup-designer')).toBe(MODEL_IDS.sonnet)
  })

  it('caps the art director (opus in prod) to sonnet in dev', () => {
    setEnv({})
    expect(modelFor('art-director')).toBe(MODEL_IDS.sonnet)
    setEnv({ PIPELINE_TIER: 'prod' })
    expect(modelFor('art-director')).toBe(MODEL_IDS.opus)
  })

  it('leaves models already at or below the dev ceiling unchanged', () => {
    setEnv({}) // dev tier
    expect(modelFor('react-engineer')).toBe(MODEL_IDS.sonnet)
    expect(modelFor('mockup-critic')).toBe(MODEL_IDS.haiku)
    expect(modelFor('screenshot-critic')).toBe(MODEL_IDS.sonnet)
  })

  it('mockup-critic resolves to haiku in prod (floors-check gate, not a taste call)', () => {
    setEnv({ PIPELINE_TIER: 'prod' })
    expect(modelFor('mockup-critic')).toBe(MODEL_IDS.haiku)
    expect(PROD_MODELS['mockup-critic']).toBe('haiku')
    // screenshot-critic (taste/fidelity judgment) stays on sonnet
    expect(modelFor('screenshot-critic')).toBe(MODEL_IDS.sonnet)
  })

  it('falls back to sonnet for an unknown agent', () => {
    setEnv({ PIPELINE_TIER: 'prod' })
    expect(modelFor('who-dis')).toBe(MODEL_IDS.sonnet)
  })

  it('resolves every tier to an explicit model ID, never a bare alias', () => {
    setEnv({ PIPELINE_TIER: 'prod' })
    for (const agent of Object.keys(PROD_MODELS)) {
      expect(modelFor(agent)).toMatch(/^claude-/)
    }
  })

  it('exposes the prod model map for reference', () => {
    expect(PROD_MODELS['mockup-designer']).toBe('opus')
    expect(PROD_MODELS['art-director']).toBe('opus')
  })
})

describe('MODEL_CATALOG', () => {
  it('prices every ID a tier can emit, and nothing else', () => {
    // Pricing used to sit in cost-ledger.js beside two IDs models.js never
    // emitted; bumping a tier made every call on the new model unpriceable
    // and the ledger marked it partial without a word.
    const emitted = Object.values(MODEL_IDS).sort()
    expect(Object.keys(MODEL_CATALOG).sort()).toEqual(emitted)
    for (const id of emitted) {
      const p = pricingFor(id)
      expect(p, `${id} has no price`).not.toBeNull()
      expect(p.input).toBeGreaterThan(0)
      expect(p.output).toBeGreaterThan(p.input)
    }
  })

  it('knows Haiku 4.5 rejects the thinking parameter', () => {
    expect(supportsAdaptiveThinking('claude-haiku-4-5')).toBe(false)
    expect(supportsAdaptiveThinking('claude-sonnet-5')).toBe(true)
    expect(supportsAdaptiveThinking('claude-opus-4-8')).toBe(true)
  })

  it('prices an unknown model to null, never zero', () => {
    expect(pricingFor('claude-from-the-future')).toBeNull()
  })
})
