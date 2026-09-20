import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ARCHIVE_LINK_INKS,
  ARCHIVE_LINK_MIN_RATIO,
  archiveLinkInks,
  assertArchiveLinkInk,
  chooseInk,
  semanticContrast,
} from '../../scripts/utils/archive-link-ink.js'
import { ARCHIVE_DIR } from '../../scripts/utils/archive-count.js'
import { parsePreset } from '../../scripts/utils/preset-parser.js'

/** A preset with the semantic colours given, in the shape the Art Director writes. */
function preset(semantic, ramps = '') {
  const lines = Object.entries(semantic).map(
    ([name, value]) => `        ${name}: { value: ${value} },`
  )
  return `export const elementsPreset = definePreset({
  theme: {
    tokens: { colors: { ${ramps} } },
    semanticTokens: {
      colors: {
${lines.join('\n')}
      },
    },
  },
})`
}

const colors = (semantic, ramps) => parsePreset(preset(semantic, ramps)).colors

describe('semanticContrast', () => {
  it('reads hex values and ramp references', () => {
    const c = colors(
      { bg: "'{colors.paper.50}'", text: "{ base: '#000000' }" },
      "paper: { 50: { value: '#ffffff' } }"
    )
    expect(semanticContrast(c, 'text', 'bg')).toBeCloseTo(21, 3)
  })

  it('follows a semantic token that names another', () => {
    const c = colors({ bg: "'#ffffff'", text: "'{colors.bg}'" })
    expect(semanticContrast(c, 'text', 'bg')).toBeCloseTo(1, 3)
  })

  it('takes the lowest ratio across every condition a token defines', () => {
    // dark by default, light under `_light`: 21:1 in one, 1.6:1 in the other
    const c = colors({
      bg: "{ base: '#000000', _light: '#ffffff' }",
      text: "{ base: '#ffffff', _light: '#dddddd' }",
    })
    expect(semanticContrast(c, 'text', 'bg')).toBeLessThan(2)
  })

  it('is null when a token is missing or will not resolve', () => {
    const c = colors({ bg: "'#ffffff'", text: "'{colors.nope.500}'" })
    expect(semanticContrast(c, 'text', 'bg')).toBeNull()
    expect(semanticContrast(c, 'textMuted', 'bg')).toBeNull()
  })
})

describe('chooseInk', () => {
  const base = { bg: "'#ffffff'", text: "'#111111'" }

  it('takes the quietest ink that reaches 4.5:1', () => {
    const c = colors({ ...base, textMuted: "'#595959'", textFaint: "'#6b6b6b'" })
    expect(chooseInk(c, 'bg').token).toBe('textFaint')
  })

  it('steps up to textMuted when textFaint is too quiet', () => {
    const c = colors({ ...base, textMuted: "'#595959'", textFaint: "'#aaaaaa'" })
    const { token, ratio } = chooseInk(c, 'bg')
    expect(token).toBe('textMuted')
    expect(ratio).toBeGreaterThanOrEqual(ARCHIVE_LINK_MIN_RATIO)
  })

  it('falls back to text when neither quiet ink reaches it', () => {
    const c = colors({ ...base, textMuted: "'#999999'", textFaint: "'#bbbbbb'" })
    expect(chooseInk(c, 'bg').token).toBe('text')
  })

  it('falls back to text when a preset defines neither quiet ink', () => {
    expect(chooseInk(colors(base), 'bg').token).toBe('text')
  })

  it('judges against the ground it is given', () => {
    const c = colors({
      bg: "'#ffffff'",
      bgAlt: "'#cccccc'",
      text: "'#000000'",
      textMuted: "'#767676'",
    })
    expect(chooseInk(c, 'bg').token).toBe('textMuted') // 4.54:1 on white
    expect(chooseInk(c, 'bgAlt').token).toBe('text') // #767676 on #ccc is under 4.5:1
  })

  it('must hold in every condition, not only the default one', () => {
    const c = colors({
      bg: "{ base: '#000000', _light: '#ffffff' }",
      text: "{ base: '#ffffff', _light: '#000000' }",
      textMuted: "{ base: '#aaaaaa', _light: '#aaaaaa' }",
    })
    // #aaaaaa is 9:1 on black and 2.3:1 on white
    expect(chooseInk(c, 'bg').token).toBe('text')
  })
})

describe('archiveLinkInks', () => {
  it('returns a token for the root link and one for the callout', () => {
    const src = preset({
      bg: "'#ffffff'",
      bgAlt: "'#cccccc'",
      text: "'#000000'",
      textMuted: "'#767676'",
      textFaint: "'#999999'",
    })
    const inks = archiveLinkInks(src)
    expect(inks.root.token).toBe('textMuted')
    expect(inks.callout.token).toBe('text')
  })

  it('measures the callout against bg when a preset has no bgAlt', () => {
    const src = preset({ bg: "'#ffffff'", text: "'#000000'", textMuted: "'#767676'" })
    expect(archiveLinkInks(src).callout).toEqual(archiveLinkInks(src).root)
  })

  it('gives a preset it cannot read the safe default', () => {
    expect(archiveLinkInks('not a preset').root).toEqual({ token: 'text', ratio: null })
  })
})

describe('assertArchiveLinkInk', () => {
  it('lets the three inks through and stops anything else reaching generated source', () => {
    for (const ink of ARCHIVE_LINK_INKS) expect(assertArchiveLinkInk(ink)).toBe(ink)
    expect(() => assertArchiveLinkInk('accent')).toThrow(/archive link ink/)
    expect(() => assertArchiveLinkInk(undefined)).toThrow(/archive link ink/)
  })
})

// The nights the choice was proved against when it was written (#566): the last
// twenty archived presets on 2026-09-20. The archive never changes, so this is a
// fixed set, not a moving window that a future palette could fail.
describe('the last twenty archived presets', () => {
  const NIGHTS = readdirSync(ARCHIVE_DIR)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= '2026-07-29' && d <= '2026-09-20')
    .sort()

  it('is the twenty the change was measured on', () => {
    expect(NIGHTS).toHaveLength(20)
  })

  it.each(NIGHTS)('%s: both links clear 4.5:1 on their ground', (night) => {
    const dir = path.join(ARCHIVE_DIR, night)
    const build = readdirSync(dir)
      .filter((f) => f.startsWith('build-'))
      .sort()
      .at(-1)
    const inks = archiveLinkInks(readFileSync(path.join(dir, build, 'preset.ts'), 'utf8'))
    expect(inks.root.ratio).toBeGreaterThanOrEqual(ARCHIVE_LINK_MIN_RATIO)
    expect(inks.callout.ratio).toBeGreaterThanOrEqual(ARCHIVE_LINK_MIN_RATIO)
  })
})
