import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  blockBody,
  blockRequest,
  spliceBlock,
  spliceBlockAnswer,
  stripOuterFence,
} from '../../scripts/utils/ad-block-splice.js'
import { parseDelimiterResponse } from '../../scripts/utils/delimiter-parser.js'
import { validateArtDirectorResult } from '../../scripts/agents/art-director.js'

const REPLY = [
  '===HERO_COPY===',
  'Two shots clear.',
  '',
  '===MOBILE===',
  'carrier: old carrier',
  'first_fold: the nav',
  '',
  '===FILE:elements/preset.ts===',
  'export const elementsPreset = {}',
  '',
  '===RATIONALE===',
  'why',
].join('\n')

/** The canary corpus's first Art Director reply was rejected over MOBILE; its retry passed. */
const canary = (n) =>
  readFileSync(path.join(__dirname, '../../fixtures/canary/art-director', `${n}.txt`), 'utf8')

describe('blockBody', () => {
  it('reads a block up to the next delimiter line', () => {
    expect(blockBody(REPLY, 'MOBILE')).toBe('carrier: old carrier\nfirst_fold: the nav')
  })

  it('reads a FILE block and the last block in the reply', () => {
    expect(blockBody(REPLY, 'FILE:elements/preset.ts')).toBe('export const elementsPreset = {}')
    expect(blockBody(REPLY, 'RATIONALE')).toBe('why')
  })

  it('is null for a block the reply does not have, and not fooled by a longer name', () => {
    expect(blockBody(REPLY, 'MOTION')).toBeNull()
    expect(blockBody('===COMPOSITION_RATIONALE===\nx', 'COMPOSITION')).toBeNull()
  })
})

describe('spliceBlock', () => {
  it('replaces one block and leaves every other byte alone', () => {
    const out = spliceBlock(REPLY, 'MOBILE', 'carrier: new\nfirst_fold: the hero')
    expect(blockBody(out, 'MOBILE')).toBe('carrier: new\nfirst_fold: the hero')
    expect(out.replace(/===MOBILE===\n[\s\S]*?\n\n(?====FILE)/, '')).toBe(
      REPLY.replace(/===MOBILE===\n[\s\S]*?\n\n(?====FILE)/, '')
    )
  })

  it('replaces the last block', () => {
    const out = spliceBlock(REPLY, 'RATIONALE', 'because')
    expect(out.endsWith('===RATIONALE===\nbecause\n')).toBe(true)
    expect(blockBody(out, 'MOBILE')).toBe('carrier: old carrier\nfirst_fold: the nav')
  })

  it('appends a block the reply left out, where the parser still finds it', () => {
    const out = spliceBlock(REPLY, 'MOTION', 'entrance: none')
    expect(parseDelimiterResponse(out).motion).toBe('entrance: none')
    expect(parseDelimiterResponse(out).rationale).toBe('why')
  })
})

describe('spliceBlockAnswer', () => {
  it('takes the asked-for block from a fenced answer and ignores anything else in it', () => {
    const answer = '```\n===MOBILE===\ncarrier: new\n\n===HERO_COPY===\nNot asked for.\n```'
    const out = spliceBlockAnswer(REPLY, answer, ['MOBILE'])
    expect(out.ok).toBe(true)
    expect(blockBody(out.reply, 'MOBILE')).toBe('carrier: new')
    expect(blockBody(out.reply, 'HERO_COPY')).toBe('Two shots clear.')
  })

  it('fails when the answer leaves out a block it was asked for', () => {
    expect(spliceBlockAnswer(REPLY, 'Here is the fix: carrier: new', ['MOBILE'])).toEqual({
      ok: false,
      error: 'the block answer has no ===MOBILE=== block',
    })
    expect(spliceBlockAnswer(REPLY, '===MOBILE===\n\n', ['MOBILE']).ok).toBe(false)
  })

  it('splices several blocks', () => {
    const answer = '===HERO_COPY===\nOne shot.\n===MOBILE===\ncarrier: new'
    const out = spliceBlockAnswer(REPLY, answer, ['HERO_COPY', 'MOBILE'])
    expect(blockBody(out.reply, 'HERO_COPY')).toBe('One shot.')
    expect(blockBody(out.reply, 'MOBILE')).toBe('carrier: new')
  })

  it('works inside a reply that was itself wrapped in a fence', () => {
    const out = spliceBlockAnswer(`\`\`\`text\n${REPLY}\n\`\`\``, '===MOTION===\nentrance: none', [
      'MOTION',
    ])
    expect(parseDelimiterResponse(out.reply).motion).toBe('entrance: none')
    expect(parseDelimiterResponse(out.reply).rationale).toBe('why')
  })

  it("fixes the canary night's rejected reply with its retry's MOBILE block alone", () => {
    const rejected = canary('00')
    expect(() => validateArtDirectorResult(parseDelimiterResponse(rejected))).toThrow(
      expect.objectContaining({ block: 'MOBILE' })
    )
    const answer = `===MOBILE===\n${blockBody(canary('01'), 'MOBILE')}\n`
    const out = spliceBlockAnswer(rejected, answer, ['MOBILE'])
    const parsed = parseDelimiterResponse(out.reply)
    expect(() => validateArtDirectorResult(parsed, { enforceSpec: false })).not.toThrow()
    // Everything but MOBILE is still the first reply's.
    const first = parseDelimiterResponse(rejected)
    expect(parsed.hero_copy).toBe(first.hero_copy)
    expect(parsed.visual_spec).toBe(first.visual_spec)
    expect(parsed.files).toEqual(first.files)
  })
})

describe('blockRequest', () => {
  it('carries the reason, the blocks to return and the previous reply unfenced', () => {
    const text = blockRequest({
      reply: `\`\`\`\n${REPLY}\n\`\`\``,
      blocks: ['MOBILE'],
      reason: 'Art Director MOBILE block is invalid: first_fold must name the hero phrase',
    })
    expect(text).toMatch(/^## Previous attempt was rejected: return only ===MOBILE===/)
    expect(text).toContain('first_fold must name the hero phrase')
    expect(text).toContain('Return only the corrected ===MOBILE=== block,')
    expect(text.endsWith(REPLY)).toBe(true)
  })
})

describe('stripOuterFence', () => {
  it('leaves an unfenced reply as it is', () => {
    expect(stripOuterFence(REPLY)).toBe(REPLY)
  })
})
