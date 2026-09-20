import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  NARROW_PX_TOKEN,
  fillViewportTokens,
  loadPrompt,
  loadPromptSync,
} from '../../scripts/utils/prompt-loader.js'

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
    expect(loaded).toBe(fillViewportTokens(raw))
    expect(loaded).not.toContain(NARROW_PX_TOKEN)
    expect(loaded).toContain(`phone filmstrips at ${NARROW_VIEWPORT.width} wide`)
    expect(loadPromptSync('screenshot-critic.md')).toBe(loaded)
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
