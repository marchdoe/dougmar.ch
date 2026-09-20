import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  DATA_BOUNDARY_RULE_TOKEN,
  NARROW_PX_TOKEN,
  SMALL_COPY_FLOOR_PX_TOKEN,
  SMALL_TEXT_FLOOR_PX_TOKEN,
  fillDataBoundaryRule,
  fillViewportTokens,
  loadPrompt,
  loadPromptSync,
} from '../../scripts/utils/prompt-loader.js'
import {
  SMALL_COPY_FLOOR_PX,
  SMALL_TEXT_FLOOR_PX,
} from '../../scripts/utils/responsive-thresholds.js'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PROMPTS = path.join(REPO, 'scripts', 'prompts')

describe('fillViewportTokens', () => {
  it('fills every occurrence with the width it is given', () => {
    for (const narrowPx of [320, 360, 412]) {
      expect(
        fillViewportTokens('at {{NARROW_PX}} and {{NARROW_PX}}px, {{NARROW_PX}}×640', { narrowPx })
      ).toBe(`at ${narrowPx} and ${narrowPx}px, ${narrowPx}×640`)
    }
  })

  it('reads NARROW_VIEWPORT when no width is passed', () => {
    expect(fillViewportTokens('the phone is {{NARROW_PX}} wide')).toBe(
      `the phone is ${NARROW_VIEWPORT.width} wide`
    )
  })

  it('leaves every other placeholder for its owner', () => {
    const text = '{{GATES}} {{ NARROW_PX }} {{narrow_px}} {{NARROW_PX_}} style={{ top: 0 }}'
    expect(fillViewportTokens(text, { narrowPx: 320 })).toBe(text)
  })
})

describe('loadPrompt and loadPromptSync', () => {
  it('return the file with the phone width filled, and agree with each other', async () => {
    const raw = readFileSync(path.join(PROMPTS, 'screenshot-critic.md'), 'utf8')
    expect(raw).toContain(NARROW_PX_TOKEN)
    const loaded = await loadPrompt('screenshot-critic.md')
    const rule = readFileSync(path.join(PROMPTS, 'data-boundary-rule.md'), 'utf8')
    expect(loaded).toBe(fillDataBoundaryRule(fillViewportTokens(raw), rule))
    expect(loaded).not.toContain(NARROW_PX_TOKEN)
    expect(loaded).toContain(`phone filmstrips at ${NARROW_VIEWPORT.width} wide`)
    expect(loadPromptSync('screenshot-critic.md')).toBe(loaded)
  })

  it('fill the data boundary rule wherever a prompt asks for it, and only there', async () => {
    const rule = readFileSync(path.join(PROMPTS, 'data-boundary-rule.md'), 'utf8').trim()
    for (const file of ['art-director.md', 'screenshot-critic.md']) {
      expect(readFileSync(path.join(PROMPTS, file), 'utf8')).toContain(DATA_BOUNDARY_RULE_TOKEN)
      const loaded = await loadPrompt(file)
      expect(loaded).not.toContain(DATA_BOUNDARY_RULE_TOKEN)
      expect(loaded).toContain(rule)
      expect(loadPromptSync(file)).toBe(loaded)
    }
    // A prompt without the token is read exactly as before.
    const plain = await loadPrompt('mockup-critic.md')
    expect(plain).not.toContain(rule)
  })

  it('fillDataBoundaryRule fills every occurrence and trims the rule', () => {
    expect(fillDataBoundaryRule('a {{DATA_BOUNDARY_RULE}} b {{DATA_BOUNDARY_RULE}}', '\nR\n')).toBe(
      'a R b R'
    )
  })

  it('reads from the root it is given', async () => {
    await expect(loadPrompt('art-director.md', { root: '/nonexistent' })).rejects.toThrow(/ENOENT/)
  })
})

/**
 * The phone width is `{{NARROW_PX}}` in a prompt source, never a literal. A
 * 360 that survives is one of the lines below, each with the reason it is
 * not the viewport or must not follow it. `hero_step_360` and `nav_360` are
 * field names the parsers read; they are dropped from a line before it is
 * checked, and renamed in a later change with a reader for old archives.
 */
describe('prompt sources do not spell the phone width out', () => {
  const FIELD_NAMES = /\b(hero_step|nav)_360\b/g
  const ALLOWED = [
    {
      file: 'art-director.md',
      line: 'exact hue angle (0–360°)',
      why: 'degrees of hue, not pixels',
    },
    {
      file: 'art-director.md',
      line: '"primary_hue": { "h": <0-360>',
      why: 'degrees of hue, not pixels',
    },
    {
      file: 'impeccable/reference/color-and-contrast.md',
      line: 'hue is 0-360',
      why: 'degrees of hue, in a vendored file',
    },
    {
      file: 'art-director.md',
      line: 'was good at 1440; at 360 the split was gone',
      why: 'what happened on 2026-09-04, when the phone was 360',
    },
    {
      file: 'mockup-critic.md',
      line: 'entirely at 360, the answer panel faced nothing',
      why: 'the same 2026-09-04 night',
    },
    {
      file: 'screenshot-critic.md',
      line: 'shipped with the split gone at 360:',
      why: 'the same 2026-09-04 night',
    },
    {
      file: 'react-engineer.md',
      line: 'a build shipped overflowing 360 by 969px',
      why: 'a measured failure on a past night; 969px was measured against 360',
    },
  ]

  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : e.name.endsWith('.md')
          ? [path.join(dir, e.name)]
          : []
    )
  // unslop.md is the owner's skill file copied verbatim by sync-unslop.js.
  const sources = walk(PROMPTS)
    .map((abs) => path.relative(PROMPTS, abs))
    .filter((rel) => rel !== 'unslop.md')

  it('outside the allowlist', () => {
    const strays = []
    for (const rel of sources) {
      const lines = readFileSync(path.join(PROMPTS, rel), 'utf8').split('\n')
      lines.forEach((text, i) => {
        if (!/(?<![0-9])360(?![0-9])/.test(text.replace(FIELD_NAMES, ''))) return
        if (ALLOWED.some((a) => a.file === rel && text.includes(a.line))) return
        strays.push(`${rel}:${i + 1}: ${text.trim()}`)
      })
    }
    expect(strays, strays.join('\n')).toEqual([])
  })

  it('and every allowlist entry still matches a line', () => {
    for (const a of ALLOWED) {
      const text = readFileSync(path.join(PROMPTS, a.file), 'utf8')
      expect(text.includes(a.line), `${a.file}: "${a.line}" (${a.why})`).toBe(true)
    }
  })
})

describe('the type-size floors are tokens filled from responsive-thresholds.js (#567)', () => {
  it('fillViewportTokens fills both, and defaults to the constants they quote', () => {
    const text =
      'copy {{SMALL_COPY_FLOOR_PX}}px, text {{SMALL_TEXT_FLOOR_PX}}px, again {{SMALL_COPY_FLOOR_PX}}'
    expect(fillViewportTokens(text)).toBe(
      `copy ${SMALL_COPY_FLOOR_PX}px, text ${SMALL_TEXT_FLOOR_PX}px, again ${SMALL_COPY_FLOOR_PX}`
    )
    expect(fillViewportTokens(text, { smallCopyPx: 15, smallTextPx: 12 })).toBe(
      'copy 15px, text 12px, again 15'
    )
  })

  it('leaves near-miss spellings for their owner', () => {
    const text = '{{ SMALL_COPY_FLOOR_PX }} {{small_text_floor_px}} {{SMALL_TEXT_FLOOR_PX_}}'
    expect(fillViewportTokens(text)).toBe(text)
  })

  // Every prompt that states a floor, and the tokens it states it with. A
  // prompt that loses its token has gone back to quoting a number nothing
  // checks against the gate.
  const STATES_A_FLOOR = [
    ['art-director.md', [SMALL_COPY_FLOOR_PX_TOKEN, SMALL_TEXT_FLOOR_PX_TOKEN]],
    ['mockup-designer.md', [SMALL_COPY_FLOOR_PX_TOKEN, SMALL_TEXT_FLOOR_PX_TOKEN]],
    ['screenshot-critic.md', [SMALL_COPY_FLOOR_PX_TOKEN, SMALL_TEXT_FLOOR_PX_TOKEN]],
    ['react-engineer.md', [SMALL_COPY_FLOOR_PX_TOKEN, SMALL_TEXT_FLOOR_PX_TOKEN]],
    ['impeccable/reference/polish.md', [SMALL_COPY_FLOOR_PX_TOKEN, SMALL_TEXT_FLOOR_PX_TOKEN]],
    ['impeccable/reference/typography.md', [SMALL_COPY_FLOOR_PX_TOKEN]],
  ]

  it.each(STATES_A_FLOOR)(
    '%s states its floors with tokens, and the loader fills them',
    async (file, tokens) => {
      const raw = readFileSync(path.join(PROMPTS, file), 'utf8')
      const loaded = await loadPrompt(file)
      for (const token of tokens) {
        expect(raw, `${file} lost ${token}`).toContain(token)
        expect(loaded).not.toContain(token)
      }
      expect(loaded).toContain(`${SMALL_COPY_FLOOR_PX}px`)
      if (tokens.includes(SMALL_TEXT_FLOOR_PX_TOKEN)) {
        expect(loaded).toContain(`${SMALL_TEXT_FLOOR_PX}px`)
      }
    }
  )
})

/**
 * A type-size floor is `{{SMALL_COPY_FLOOR_PX}}` or `{{SMALL_TEXT_FLOOR_PX}}`
 * in a prompt source, never a literal. The art director said 14, the mockup
 * designer 16 and the gate warned at 16, so nothing was wrong until a night
 * found the gap (#567). A line that names a size of 9 to 18px next to floor
 * wording is a stray unless it is one of the lines below, each with the reason
 * it is not the gate's floor.
 */
describe('prompt sources do not state a type-size floor as a number', () => {
  const SIZE = /(?<![\d.\-–])(9|1[0-8])(\.\d+)?\s?px/
  const FLOOR_WORDS =
    /(smaller than|below|under|at least|minimum|floor|no (body |visible )?text|≥|≤|\bmin\b)/i
  const ALLOWED = [
    {
      file: 'art-director.md',
      line: 'Large text (24px+, or 18.66px+ bold): ≥ 3:1',
      why: 'the WCAG large-text size, a contrast rule',
    },
    {
      file: 'art-director.md',
      line: 'measures all text under 24px (18.66px bold)',
      why: 'the same large-text size, in the contrast gate',
    },
    {
      file: 'react-engineer.md',
      line: 'every piece of visible text under 24px (under 18.66px when bold)',
      why: 'the same large-text size, in the contrast gate',
    },
    {
      file: 'brand-contract.md',
      line: 'floors at 13px so it stays legible when the lockup runs small',
      why: 'the wordmark inside the orchestrator-written lockup, not page text',
    },
  ]

  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : e.name.endsWith('.md')
          ? [path.join(dir, e.name)]
          : []
    )
  const sources = walk(PROMPTS)
    .map((abs) => path.relative(PROMPTS, abs))
    .filter((rel) => rel !== 'unslop.md')

  it('outside the allowlist', () => {
    const strays = []
    for (const rel of sources) {
      readFileSync(path.join(PROMPTS, rel), 'utf8')
        .split('\n')
        .forEach((text, i) => {
          if (!SIZE.test(text) || !FLOOR_WORDS.test(text)) return
          if (ALLOWED.some((a) => a.file === rel && text.includes(a.line))) return
          strays.push(`${rel}:${i + 1}: ${text.trim()}`)
        })
    }
    expect(strays, strays.join('\n')).toEqual([])
  })

  it('and every allowlist entry still matches a line', () => {
    for (const a of ALLOWED) {
      const text = readFileSync(path.join(PROMPTS, a.file), 'utf8')
      expect(text.includes(a.line), `${a.file}: "${a.line}" (${a.why})`).toBe(true)
    }
  })

  it('and the patterns catch the two lines it was written for', () => {
    // What the art director and the mockup designer said before #567.
    const before = [
      '- No body text smaller than 14px (0.875rem)',
      '- Body text ≥ 16px at all viewports.',
    ]
    for (const line of before) expect(SIZE.test(line) && FLOOR_WORDS.test(line), line).toBe(true)
  })
})
