import { describe, expect, it } from 'vitest'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import {
  colorSection,
  heroStepOffRamp,
  presetColors,
  rampCeiling,
  specFindings,
  undefinedSpecHexes,
  unrenderableHeroScale,
} from '../../scripts/utils/ad-spec-checks.js'
import { HERO_STEPS_360 } from '../../scripts/utils/mobile-grammar.js'

const PRESET = `
import { definePreset } from '@pandacss/dev'
export const elementsPreset = definePreset({
  name: 'elements',
  theme: {
    tokens: {
      colors: {
        pine: { 400: { value: '#2fb381' }, 600: { value: '#0a7d54' } },
        sage: { 50: { value: '#f4f7f5' }, 900: { value: '#111a15' } },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.sage.50}' } },
        surface: { value: { base: '#ffffff' } },
      },
    },
  },
})
`

const SPEC = `### 1. Color Specification
- **Neutral palette**: 50 \`#f4f7f5\`, 900 \`#111a15\`
- **Accent color**: default \`#0a7d54\`, light \`#2fb381\`
- **Background**: card \`#ffffff\`

### 2. Typography
- Hero at \`hero\`.

### 5. Signal Integration
- The Tigers navy \`#0c2340\` sits in the footer ledger.
`

const chassis = (id) => CHASSIS_CATALOG.find((c) => c.id === id)

describe('colorSection', () => {
  it('keeps only the numbered section whose heading names colour', () => {
    const section = colorSection(SPEC)
    expect(section).toContain('#0a7d54')
    expect(section).not.toContain('#0c2340')
  })

  it('reads a bold numbered heading the way it reads a markdown one', () => {
    const spec = '**1. Color Specification**\n- accent `#0a7d54`\n\n**2. Typography**\n- `#abcdef`'
    expect(colorSection(spec)).toContain('#0a7d54')
    expect(colorSection(spec)).not.toContain('#abcdef')
  })

  it('reads the whole spec when no heading names colour', () => {
    const spec = '### 1. Palette\n- accent `#0a7d54`\n### 2. Type\n- `#abcdef`'
    expect(colorSection(spec)).toBe(spec)
  })
})

describe('presetColors', () => {
  it('collects ramp and semantic hexes with the token each lives at', () => {
    const colors = presetColors(PRESET)
    expect(colors.get('#2fb381')).toBe('colors.ramps.pine.400')
    expect(colors.get('#ffffff')).toBe('colors.semantic.surface.base')
  })

  it('does not count a hex that only a comment mentions', () => {
    const colors = presetColors(`${PRESET}\n// raised surface #2a2246`)
    expect(colors.has('#2a2246')).toBe(false)
  })

  it('falls back to every hex in the source when the theme will not parse', () => {
    const colors = presetColors("const x = '#abcdef'; theme: { tokens: { colors: ...spread } }")
    expect(colors.has('#abcdef')).toBe(true)
  })
})

describe('check 1: a spec hex the preset does not define', () => {
  it('passes a spec whose every colour is in the preset, in either case', () => {
    expect(undefinedSpecHexes(SPEC, PRESET)).toEqual([])
    expect(undefinedSpecHexes(SPEC.toUpperCase(), PRESET)).toEqual([])
  })

  it('names the hex and the closest colour the preset does define', () => {
    const [finding] = undefinedSpecHexes(SPEC.replace('#0a7d54', '#e86f1e'), PRESET)
    expect(finding).toContain('#e86f1e (closest in the preset: ')
    expect(finding).toContain('===FILE:elements/preset.ts===')
  })

  it('lets a hex a few units off a preset colour stand as that colour', () => {
    // #0a7d54 -> #0a7f56 is a distance of 2.8.
    expect(undefinedSpecHexes(SPEC.replace('#0a7d54', '#0a7f56'), PRESET)).toEqual([])
  })

  it('does not let a colour that was meant to be another stand', () => {
    // #0a7d54 -> #109a68 is a distance of 33.
    expect(undefinedSpecHexes(SPEC.replace('#0a7d54', '#109a68'), PRESET)).toHaveLength(1)
  })

  it('ignores a hex named outside the Color Specification', () => {
    // SPEC's Signal Integration section names #0c2340, which the preset lacks.
    expect(SPEC).toContain('#0c2340')
    expect(undefinedSpecHexes(SPEC, PRESET)).toEqual([])
  })

  it('compares against the preset it is given, not the one on disk', () => {
    const other = PRESET.replace('#0a7d54', '#0a7d55').replace('#2fb381', '#ff0000')
    expect(undefinedSpecHexes(SPEC, other)).toHaveLength(1)
  })

  it('lists six offenders and counts the rest', () => {
    const hexes = ['#010101', '#101010', '#202020', '#303030', '#404040', '#505050', '#606060']
    const spec = `### 1. Color\n${hexes.map((h) => `- \`${h}\``).join('\n')}`
    const [finding] = undefinedSpecHexes(spec, PRESET)
    expect(finding).toContain('#505050')
    expect(finding).not.toContain('#606060')
    expect(finding).toContain(', and 1 more')
  })

  it('skips a preset that defines no hex, since there is nothing to compare', () => {
    expect(undefinedSpecHexes(SPEC, 'definePreset({ theme: { tokens: { colors: {} } } })')).toEqual(
      []
    )
  })
})

describe('check 2: hero_scale above the chassis ramp', () => {
  const figtree = chassis('unbounded-figtree')

  it('resolves the clamp at 1440 and finds the biggest step on the ramp', () => {
    expect(rampCeiling(figtree)).toEqual({ px: 160, step: '5xl' })
  })

  it('passes a declaration the ramp reaches', () => {
    expect(unrenderableHeroScale('clamp(64px, 8.5vw, 136px)', figtree)).toEqual([])
    expect(unrenderableHeroScale('120px', figtree)).toEqual([])
  })

  it('passes a declaration within 10% of the ceiling', () => {
    expect(unrenderableHeroScale('clamp(56px, 12vw, 177px)', figtree)).toEqual([])
  })

  it('names the field, the value, the ceiling and the step', () => {
    const [finding] = unrenderableHeroScale('clamp(140px, 27vw, 400px)', figtree)
    expect(finding).toContain('MEASURABLES hero_scale "clamp(140px, 27vw, 400px)"')
    expect(finding).toContain('resolves to 389px at 1440px')
    expect(finding).toContain('chassis unbounded-figtree tops out at 160px there (its 5xl step)')
  })

  it('says so when no chassis in the catalog reaches the size', () => {
    const [finding] = unrenderableHeroScale('clamp(140px, 27vw, 400px)', figtree)
    expect(finding).toContain('no chassis in the catalog reaches 389px')
  })

  it('offers the chassis whose ramp does reach it', () => {
    const tall = { id: 'tall', type: { steps: { hero: { size: '12rem' } } } }
    const [finding] = unrenderableHeroScale('180px', figtree, [figtree, tall])
    expect(finding).toContain('pick a chassis whose ramp reaches 180px: tall')
  })

  it('skips a form it cannot resolve, and a chassis it does not know', () => {
    expect(unrenderableHeroScale('calc(10vw + 4rem)', figtree)).toEqual([])
    expect(unrenderableHeroScale('clamp(140px, 27vw, 400px)', null)).toEqual([])
    expect(unrenderableHeroScale(null, figtree)).toEqual([])
  })
})

describe('check 3: hero_step_360 off the chassis ramp', () => {
  it('cannot fire for any step the mobile grammar allows on any chassis in the catalog', () => {
    for (const c of CHASSIS_CATALOG) {
      for (const step of HERO_STEPS_360) {
        expect(heroStepOffRamp(step, c), `${c.id} ${step}`).toEqual([])
      }
    }
  })

  it('names the step and the steps the chassis has when its ramp is partial', () => {
    const partial = {
      id: 'partial',
      type: { steps: { hero: { size: '6rem' }, base: { size: '1rem' } } },
    }
    const [finding] = heroStepOffRamp('3xl', partial)
    expect(finding).toBe(
      'MOBILE hero_step_360 "3xl" is not a step on the partial ramp (it has: hero, base). Pick one of those.'
    )
  })

  it('skips a chassis it does not know', () => {
    expect(heroStepOffRamp('3xl', null)).toEqual([])
  })
})

describe('specFindings', () => {
  const reply = {
    visualSpec: SPEC,
    presetTs: PRESET,
    chassisId: 'unbounded-figtree',
    measurables: { hero_scale: 'clamp(64px, 8.5vw, 136px)' },
    mobile: { hero_step_360: 'hero' },
  }

  it('returns nothing for a reply that agrees with itself', () => {
    expect(specFindings(reply)).toEqual([])
  })

  it('returns one finding per failed check', () => {
    const findings = specFindings({
      ...reply,
      visualSpec: SPEC.replace('#0a7d54', '#e86f1e'),
      measurables: { hero_scale: 'clamp(140px, 27vw, 400px)' },
    })
    expect(findings).toHaveLength(2)
    expect(findings[0]).toContain('#e86f1e')
    expect(findings[1]).toContain('hero_scale')
  })

  it('skips the chassis checks for a chassis id the catalog lacks', () => {
    const findings = specFindings({
      ...reply,
      chassisId: 'no-such-chassis',
      measurables: { hero_scale: 'clamp(140px, 27vw, 400px)' },
    })
    expect(findings).toEqual([])
  })
})
