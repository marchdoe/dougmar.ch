/**
 * The type system is the one part of the design system no agent authors. If
 * it stops covering the sizes a page actually needs, the engineer reaches for
 * a name that isn't there and Panda ships `font-size:7xl` without complaint —
 * which is how a 64px mobile hero rendered at the browser's default 32px
 * (#252). Since #253 the chassis carries the whole system: an explicit step
 * table (size, leading, tracking per step), a weights map, and a spacing
 * rhythm, all emitted from renderChassisPresetFile.
 */
import { describe, it, expect } from 'vitest'
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import { scaleSteps, fluid, RAMP_STEPS } from '../../elements/chassis/scale.js'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import {
  buildGoogleFontsUrl,
  buildFontSizes,
  buildTextStyles,
  buildFontWeights,
  buildLineHeights,
  buildLetterSpacings,
  buildSpacing,
  rhythmPx,
  stepPxAt,
  renderChassisPresetFile,
  formatChassisCatalogForPrompt,
  formatChassisSelectionForPrompt,
} from '../../scripts/utils/chassis.js'

/** A plain 1.5-ratio chassis the worked-out numbers below refer to. */
const TEST_CHASSIS = {
  id: 'test-1-5',
  fonts: {
    display: {
      family: 'Unbounded',
      fallbacks: ['Arial', 'sans-serif'],
      weights: [400, 900],
      italics: false,
    },
    body: {
      family: 'Figtree',
      fallbacks: ['system-ui', 'sans-serif'],
      weights: [400, 700],
      italics: false,
    },
  },
  type: {
    steps: scaleSteps(1.5, '1rem'),
    weights: { light: 400, normal: 400, medium: 400, semibold: 700, bold: 900 },
  },
}

const px = (value) => Math.round(parseFloat(value) * 16 * 10) / 10

/** The content column a 360px viewport actually offers, measured on the
 *  canary #457 was filed against. */
const NARROW_COLUMN_PX = 317

/** Width of an eight-character project name as a multiple of its font size,
 *  from the same measurement: "Spaceman" at 89.76px ran to 388px. */
const EIGHT_CHAR_EM = 388 / 89.76

/** The ceiling scale.js holds every step's 1440px size to, in rem. */
const DESKTOP_MAX_REM = 10

/** A step's 1440px maximum in rem, whichever of the two size forms it uses. */
const maxRemOf = (size) => Number(size.match(/([\d.]+)rem\)?$/)[1])

/** The ratio a chassis was authored on, read back off its own table: `md` is
 *  one ratio step above `base`. Derived rather than listed, so adding a
 *  chassis never means updating a map here. */
const ratioOf = (chassis) =>
  parseFloat(chassis.type.steps.md.size) / parseFloat(chassis.type.steps.base.size)

describe('scaleSteps — the generated table', () => {
  const steps = scaleSteps(1.5, '1rem')

  it('names every step a component can ask for, in ramp order', () => {
    expect(Object.keys(steps)).toEqual([
      '2xs',
      'xs',
      'sm',
      'base',
      'lede',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      'hero',
    ])
  })

  it('keeps base at the given base size', () => {
    expect(steps.base.size).toBe('1rem')
    expect(scaleSteps(1.5, '1.125rem').base.size).toBe('1.125rem')
  })

  it('runs the ratio up to the desktop ceiling and three equal steps down to a 12px 2xs', () => {
    expect(steps.md.size).toBe('1.5rem')
    expect(steps.lg.size).toBe('2.25rem')
    expect(stepPxAt(steps.xl, 1440)).toBe(54)
    expect(stepPxAt(steps['2xl'], 1440)).toBe(81)
    expect(stepPxAt(steps['5xl'], 1440)).toBe(160)
    expect(steps.sm.size).toBe('0.909rem')
    expect(steps.xs.size).toBe('0.825rem')
    expect(steps['2xs'].size).toBe('0.75rem')
  })

  it('floors 2xs at 12px on every chassis, with each small step 1.1 over the next (#564)', () => {
    for (const c of CHASSIS_CATALOG) {
      const t = c.type.steps
      expect(stepPxAt(t['2xs'], 360), c.id).toBe(12)
      const small = ['2xs', 'xs', 'sm', 'base'].map((s) => parseFloat(t[s].size))
      for (let i = 1; i < small.length; i++) {
        expect(small[i] / small[i - 1], `${c.id} ${i}`).toBeGreaterThanOrEqual(1.0999)
      }
    }
  })

  it('sets lede between base and md at 18 to 20px on every chassis (#564)', () => {
    expect(steps.lede.size).toBe('1.225rem')
    expect(stepPxAt(scaleSteps(1.333, '1rem').lede, 1440)).toBe(18.5)
    expect(stepPxAt(scaleSteps(1.618, '1rem').lede, 1440)).toBe(20)
    for (const c of CHASSIS_CATALOG) {
      const px = stepPxAt(c.type.steps.lede, 1440)
      expect(px, c.id).toBeGreaterThanOrEqual(18)
      expect(px, c.id).toBeLessThanOrEqual(20)
      expect(px / stepPxAt(c.type.steps.base, 1440), c.id).toBeGreaterThan(1.1)
      expect(stepPxAt(c.type.steps.md, 1440) / px, c.id).toBeGreaterThan(1.1)
    }
  })

  it('tightens leading as size grows and opens tracking below base', () => {
    expect(steps.base.lineHeight).toBe(1.5)
    expect(steps['2xl'].lineHeight).toBeLessThan(steps.md.lineHeight)
    expect(steps.hero.lineHeight).toBeLessThanOrEqual(steps['2xl'].lineHeight)
    expect(steps['2xs'].tracking).toBe('0.04em')
    expect(steps['2xl'].tracking).toBe('-0.015em')
  })

  it('starts the hero where the pre-table ramp did at ratio 1.5 and tops it out at 4xl', () => {
    // 5.063rem at 360 is the pre-table hero; its 1440 end used to be 3xl's
    // 7.594rem, under 4xl's 10rem (#564).
    expect(steps.hero.size).toBe('clamp(5.063rem, 3.417rem + 7.314vw, 10rem)')
  })

  it('never lets 4xl out-size the hero, at any width, on any chassis (#564)', () => {
    for (const c of CHASSIS_CATALOG) {
      const t = c.type.steps
      for (const width of [320, 360, 600, 820, 1024, 1440, 1920]) {
        expect(stepPxAt(t.hero, width), `${c.id} @${width}`).toBeGreaterThanOrEqual(
          stepPxAt(t['4xl'], width)
        )
      }
    }
  })

  it('raises a declared hero that 4xl would out-size, and leaves one that clears it', () => {
    // anybody-franklin declares fluid('4.5rem', '7.5rem'); its 4xl tops out at 7.993rem.
    const anybody = CHASSIS_CATALOG.find((c) => c.id === 'anybody-franklin')
    expect(anybody.type.steps.hero.size).toBe(fluid('4.5rem', '7.993rem'))
    const clear = scaleSteps(1.333, '1rem', { hero: { size: fluid('4.5rem', '7.5rem') } })
    expect(clear.hero.size).toBe(fluid('4.5rem', '7.5rem'))
  })

  it('runs xl through 5xl as clamps and leaves lg and below fixed', () => {
    for (const step of ['xl', '2xl', '3xl', '4xl', '5xl']) {
      expect(steps[step].size, step).toMatch(/^clamp\(/)
    }
    for (const step of ['2xs', 'xs', 'sm', 'base', 'lede', 'md', 'lg']) {
      expect(steps[step].size, step).toMatch(/^[\d.]+rem$/)
    }
  })

  it('caps each display clamp at the value the fixed step shipped, up to the ceiling', () => {
    // The geometric ramp, base 1rem on ratio 1.5. #457 and #469 only changed
    // where each step starts at 360, so xl to 3xl are the sizes the fixed
    // table shipped. 4xl (11.391rem) and 5xl (17.086rem) were over 10rem.
    const maxOf = (size) => size.match(/,\s*([\d.]+rem)\)$/)[1]
    expect(maxOf(steps.xl.size)).toBe('3.375rem')
    expect(maxOf(steps['2xl'].size)).toBe('5.063rem')
    expect(maxOf(steps['3xl'].size)).toBe('7.594rem')
    expect(maxOf(steps['4xl'].size)).toBe('10rem')
    expect(maxOf(steps['5xl'].size)).toBe('10rem')
  })

  it('leaves every step of a 1.5 chassis that was under the ceiling as it was', () => {
    // Pinned as strings, not recomputed: the ceiling must not disturb a clamp
    // it has no reason to touch, including the 360px end of the ones it does.
    expect(Object.fromEntries(RAMP_STEPS.map((s) => [s, steps[s].size]))).toEqual({
      '2xs': '0.75rem',
      xs: '0.825rem',
      sm: '0.909rem',
      base: '1rem',
      lede: '1.225rem',
      md: '1.5rem',
      lg: '2.25rem',
      xl: 'clamp(2.585rem, 2.322rem + 1.17vw, 3.375rem)',
      '2xl': 'clamp(2.969rem, 2.271rem + 3.102vw, 5.063rem)',
      '3xl': 'clamp(3.41rem, 2.015rem + 6.199vw, 7.594rem)',
      '4xl': 'clamp(3.917rem, 1.889rem + 9.012vw, 10rem)',
      '5xl': 'clamp(4.5rem, 2.667rem + 8.148vw, 10rem)',
      hero: 'clamp(5.063rem, 3.417rem + 7.314vw, 10rem)',
    })
  })

  it('flattens the top of a 1.618 ramp onto the ceiling, hero included', () => {
    // Uncapped: 3xl 11.09rem, 4xl 17.944rem, 5xl 29.03rem (464px), hero 11.09rem.
    const loud = scaleSteps(1.618, '1rem')
    expect(stepPxAt(loud['2xl'], 1440)).toBe(109.7)
    for (const step of ['3xl', '4xl', '5xl', 'hero']) {
      expect(stepPxAt(loud[step], 1440), step).toBe(160)
    }
  })

  it('holds a chassis override to the ceiling, clamp or bare rem', () => {
    const over = scaleSteps(1.5, '1rem', {
      hero: { size: fluid('5rem', '14rem') },
      '4xl': { size: '12rem' },
      '5xl': { size: fluid('10.5rem', '14rem') },
      '3xl': { size: fluid('4rem', '9rem') },
    })
    expect(over['4xl'].size).toBe('10rem')
    // Capped to fluid('5rem', '10rem'), then raised to the flat 4xl it may not
    // fall under (#564).
    expect(over.hero.size).toBe('10rem')
    // A minimum already at the ceiling has nothing left to interpolate.
    expect(over['5xl'].size).toBe('10rem')
    expect(over['3xl'].size).toBe(fluid('4rem', '9rem'))
  })

  it('compresses the narrow end onto a smaller ratio, topping out at the ceiling', () => {
    // 5xl lands on the narrow ceiling — the lower of the hero's own 360px size
    // and the 72px an eight-character word can occupy in a 317px column — and
    // the four steps below it fall out geometrically from the fixed lg.
    expect(stepPxAt(steps['5xl'], 360)).toBe(72)
    const narrow = ['xl', '2xl', '3xl', '4xl', '5xl'].map((s) => stepPxAt(steps[s], 360))
    expect(narrow).toEqual([41.4, 47.5, 54.6, 62.7, 72])
    // One compressed ratio throughout: 1.1487, the fifth root of the
    // ceiling over the fixed lg. (Loose to 2dp — stepPxAt rounds to 0.1px.)
    const gaps = narrow.slice(1).map((v, i) => v / narrow[i])
    for (const gap of gaps) expect(gap).toBeCloseTo(1.1487, 2)
  })

  it('keeps the display hierarchy legible at 360 on a 1.618 chassis (#469)', () => {
    // With xl fixed at 67.8px, 94% of the 72px ceiling, the four fluid steps
    // above it were within 1.5% of each other at 360. Anchoring on lg gives
    // the five steps an 11% ratio each; desktop xl does not move.
    const loud = scaleSteps(1.618, '1rem')
    expect(stepPxAt(loud.xl, 1440)).toBe(67.8)
    const narrow = ['xl', '2xl', '3xl', '4xl', '5xl'].map((s) => stepPxAt(loud[s], 360))
    expect(narrow).toEqual([46.7, 52, 58, 64.6, 72])
    const gaps = narrow.slice(1).map((v, i) => v / narrow[i])
    for (const gap of gaps) expect(gap).toBeGreaterThan(1.1)
  })

  it('leaves a chassis gentle enough to already fit 360 entirely fixed', () => {
    // The compressed ratio is capped at the chassis ratio, so the narrow end
    // can never expand a scale. On a 1.2 ratio the whole ramp tops out at 57px
    // and there is nothing to shrink.
    const gentle = scaleSteps(1.2, '1rem')
    for (const step of ['xl', '2xl', '3xl', '4xl', '5xl']) {
      expect(gentle[step].size, step).toMatch(/^[\d.]+rem$/)
    }
  })

  it('floors the hero at 64px and spans it to 1.5x on a gentle ratio', () => {
    // At 1.333 the 2xl step is 50.5px, below the mockup critic's 64px mobile
    // floor — the undershoot #257 found and left for this change.
    const gentle = scaleSteps(1.333, '1rem')
    expect(stepPxAt(gentle.hero, 360)).toBe(64)
    expect(stepPxAt(gentle.hero, 1440)).toBe(96)
  })

  it('applies per-step overrides field by field', () => {
    const overridden = scaleSteps(1.5, '1rem', {
      hero: { lineHeight: 0.9 },
      '2xl': { tracking: '0' },
    })
    expect(overridden.hero.lineHeight).toBe(0.9)
    expect(overridden.hero.size).toBe(steps.hero.size)
    expect(overridden['2xl'].tracking).toBe('0')
    expect(overridden['2xl'].lineHeight).toBe(1.1)
  })

  it('rejects an override naming a step that does not exist', () => {
    expect(() => scaleSteps(1.5, '1rem', { '6xl': { lineHeight: 1 } })).toThrow(/unknown step/)
  })
})

describe('fluid', () => {
  it('interpolates between 360px and 1440px viewports', () => {
    const clamp = fluid('4rem', '6rem')
    expect(clamp).toBe('clamp(4rem, 3.333rem + 2.963vw, 6rem)')
    expect(stepPxAt({ size: clamp }, 360)).toBe(64)
    expect(stepPxAt({ size: clamp }, 1440)).toBeCloseTo(96, 0)
  })
})

describe('buildFontSizes', () => {
  it('is a straight read of the step table', () => {
    const sizes = buildFontSizes(TEST_CHASSIS)
    expect(Object.keys(sizes)).toEqual(RAMP_STEPS)
    expect(sizes['2xl'].value).toBe('clamp(2.969rem, 2.271rem + 3.102vw, 5.063rem)')
    expect(sizes.hero.value).toBe('clamp(5.063rem, 3.417rem + 7.314vw, 10rem)')
  })

  it('refuses a table with a missing step rather than shipping a gap', () => {
    const broken = { id: 'broken', type: { steps: { base: { size: '1rem' } } } }
    expect(() => buildFontSizes(broken)).toThrow(/missing "2xs"/)
  })
})

describe('buildTextStyles', () => {
  it('bundles size, leading and tracking per step, sizing via the step token', () => {
    const styles = buildTextStyles(TEST_CHASSIS)
    expect(Object.keys(styles)).toEqual(RAMP_STEPS)
    expect(styles.hero.value).toEqual({
      fontSize: 'hero',
      lineHeight: '0.95',
      letterSpacing: '-0.02em',
    })
    expect(styles.base.value).toEqual({ fontSize: 'base', lineHeight: '1.5', letterSpacing: '0' })
  })
})

describe('derived legacy tokens', () => {
  it('derives lineHeights from the step table', () => {
    expect(buildLineHeights(TEST_CHASSIS)).toEqual({
      tight: { value: '0.95' },
      snug: { value: '1.1' },
      normal: { value: '1.5' },
      loose: { value: '1.7' },
    })
  })

  it('derives letterSpacings from the step table', () => {
    expect(buildLetterSpacings(TEST_CHASSIS)).toEqual({
      tight: { value: '-0.015em' },
      normal: { value: '0' },
      wide: { value: '0.04em' },
      wider: { value: '0.08em' },
      widest: { value: '0.14em' },
    })
  })

  it('emits fontWeights from the chassis weights map', () => {
    expect(buildFontWeights(TEST_CHASSIS).bold).toEqual({ value: '900' })
    expect(() => buildFontWeights({ id: 'x', type: { steps: TEST_CHASSIS.type.steps } })).toThrow(
      /weights/
    )
  })
})

describe('buildSpacing — rhythm-derived', () => {
  it('reproduces the historical nine values at the default 24px rhythm', () => {
    expect(rhythmPx(TEST_CHASSIS)).toBe(24)
    const spacing = buildSpacing(TEST_CHASSIS)
    expect(Object.entries(spacing).map(([k, v]) => [k, v.value])).toEqual([
      ['1', '4px'],
      ['2', '8px'],
      ['3', '16px'],
      ['4', '24px'],
      ['5', '32px'],
      ['6', '48px'],
      ['7', '64px'],
      ['8', '96px'],
      ['9', '128px'],
    ])
  })

  it('follows a declared rhythm', () => {
    const chassis = {
      ...TEST_CHASSIS,
      type: { ...TEST_CHASSIS.type, rhythm: '2rem' },
    }
    expect(rhythmPx(chassis)).toBe(32)
    expect(buildSpacing(chassis)['4'].value).toBe('32px')
  })

  it('follows the body leading when no rhythm is declared', () => {
    const chassis = {
      ...TEST_CHASSIS,
      type: {
        ...TEST_CHASSIS.type,
        steps: scaleSteps(1.5, '1rem', { base: { lineHeight: 1.55 } }),
      },
    }
    expect(rhythmPx(chassis)).toBeCloseTo(24.8, 5)
    expect(buildSpacing(chassis)['4'].value).toBe('25px')
  })
})

describe('buildGoogleFontsUrl — family merging', () => {
  it('merges two tokens naming one family into a single css2 family param', () => {
    const solo = CHASSIS_CATALOG.find((c) => c.id === 'hanken-solo')
    const url = buildGoogleFontsUrl(solo)
    expect(url.match(/family=/g)).toHaveLength(1)
    // Union of display [800] and body [400, 600], italics OR'd on.
    expect(url).toContain('family=Hanken+Grotesk:ital,wght@0,400;0,600;0,800;1,400;1,600;1,800')
  })

  it('keeps distinct families separate', () => {
    const url = buildGoogleFontsUrl(TEST_CHASSIS)
    expect(url).toContain('family=Unbounded:wght@400;900')
    expect(url).toContain('family=Figtree:wght@400;700')
  })
})

describe('the catalog', () => {
  it('holds fifteen chassis with unique ids', () => {
    expect(CHASSIS_CATALOG).toHaveLength(15)
    expect(new Set(CHASSIS_CATALOG.map((c) => c.id)).size).toBe(15)
  })

  it('gives every chassis a class from the six the mandate tracks (#502)', () => {
    const classes = ['serif', 'grotesque', 'condensed', 'slab', 'mono', 'display']
    for (const c of CHASSIS_CATALOG) {
      expect(classes, `${c.id} class`).toContain(c.class)
    }
    // Every class is represented, so "classes that have not shipped" is never empty by construction.
    expect(new Set(CHASSIS_CATALOG.map((c) => c.class)).size).toBe(6)
    expect(CHASSIS_CATALOG.filter((c) => c.class === 'condensed').map((c) => c.id)).toEqual([
      'big-shoulders-atkinson',
      'anton-inter-tight',
      'bebas-plex',
    ])
  })

  it('renders the catalog table with a Class column beside the name (#502)', () => {
    const table = formatChassisCatalogForPrompt(CHASSIS_CATALOG)
    expect(table.split('\n')[0]).toBe(
      `| ID | Name | Class | Feel | Moods | Best for archetypes | Hero px ${NARROW_VIEWPORT.width}→1440 | 5xl px ${NARROW_VIEWPORT.width}→1440 |`
    )
    expect(table).toContain('| `bebas-plex` | Bebas Neue + IBM Plex Sans | condensed |')
    expect(table).toContain('| `spectral-albert` | Spectral + Albert Sans | serif |')
  })

  it('states which chassis load display italics and which load one weight (#502)', () => {
    const facts = formatChassisSelectionForPrompt(CHASSIS_CATALOG)
    expect(facts).toContain(
      'Display italics load on spectral-albert, fraunces-karla, dm-serif-public, zilla-worksans, space-mono-archivo, anybody-franklin only'
    )
    expect(facts).toContain(
      'A single display weight loads on anton-inter-tight, bebas-plex, dm-serif-public, hanken-solo, alfa-rubik'
    )
  })

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))('%s passes the schema check', (_id, chassis) => {
    expect(chassis.name).toBeTruthy()
    expect(chassis.description).toBeTruthy()
    expect(chassis.moods.length).toBeGreaterThan(0)
    expect(chassis.archetypes.length).toBeGreaterThan(0)
    expect(chassis.fonts.display).toBeDefined()
    expect(chassis.fonts.body).toBeDefined()
    for (const font of Object.values(chassis.fonts)) {
      expect(font.weights.length).toBeGreaterThan(0)
    }
    for (const step of RAMP_STEPS) {
      const s = chassis.type.steps[step]
      expect(s?.size, `${step} size`).toBeTruthy()
      expect(s.lineHeight, `${step} lineHeight`).toBeGreaterThan(0)
      expect(s.tracking, `${step} tracking`).toBeDefined()
    }
  })

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s has monotonically increasing sizes from 2xs to 5xl at 360 and at 1440',
    (_id, chassis) => {
      const fixed = RAMP_STEPS.filter((s) => s !== 'hero')
      // Both ends, since #457: the display steps interpolate, and a narrow-end
      // minimum picked without regard for the step below it would let the ramp
      // flatten or invert on a phone while reading fine on the desktop.
      //
      // Strictly increasing, with one exception: steps that have reached the
      // desktop ceiling sit level on it at 1440. Nothing may ever step down.
      const ceilingPx = DESKTOP_MAX_REM * 16
      for (const viewport of [360, 1440]) {
        for (let i = 1; i < fixed.length; i++) {
          const prev = stepPxAt(chassis.type.steps[fixed[i - 1]], viewport)
          const next = stepPxAt(chassis.type.steps[fixed[i]], viewport)
          const label = `${fixed[i]} vs ${fixed[i - 1]} at ${viewport}`
          if (prev === ceilingPx) expect(next, label).toBe(ceilingPx)
          else expect(next, label).toBeGreaterThan(prev)
        }
      }
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s keeps every step, hero included, at or under 10rem',
    (_id, chassis) => {
      for (const step of RAMP_STEPS) {
        const { size } = chassis.type.steps[step]
        expect(maxRemOf(size), `${step} max`).toBeLessThanOrEqual(DESKTOP_MAX_REM)
        expect(stepPxAt({ size }, 1440), `${step} at 1440`).toBeLessThanOrEqual(160)
        // Past 1440 too: the clamp's last term is the size on any wider screen.
        expect(stepPxAt({ size }, 2560), `${step} at 2560`).toBeLessThanOrEqual(160)
      }
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s runs xl through 5xl as clamps whose maximum is the geometric step or the ceiling',
    (_id, chassis) => {
      // Desktop is the contract: whatever the narrow end does, the top of each
      // clamp is still base × ratio^n, the size the fixed table shipped, until
      // that passes 10rem.
      const ratio = ratioOf(chassis)
      for (const [i, step] of ['xl', '2xl', '3xl', '4xl', '5xl'].entries()) {
        const size = chassis.type.steps[step].size
        expect(size, step).toMatch(/^clamp\(/)
        const max = Number(size.match(/,\s*([\d.]+)rem\)$/)[1])
        expect(max, `${step} max`).toBeCloseTo(Math.min(ratio ** (3 + i), DESKTOP_MAX_REM), 2)
      }
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s sets an eight-character project name inside a 317px column at 360',
    (_id, chassis) => {
      // The #457 regression, pinned. On the canary the issue was filed against,
      // an <h2> reading "Spaceman" was set at 89.8px — a fixed 4xl, identical at
      // 360 and 1440 — and needed 388px of a 317px column. That is 0.54em of
      // advance per character, the factor below.
      for (const step of ['xl', '2xl', '3xl', '4xl', '5xl']) {
        const px = stepPxAt(chassis.type.steps[step], 360)
        expect(px * EIGHT_CHAR_EM, `${step} at 360`).toBeLessThanOrEqual(NARROW_COLUMN_PX)
      }
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s reaches marquee: hero is 64px+ at 360 and 96px+ at 1440',
    (_id, chassis) => {
      expect(stepPxAt(chassis.type.steps.hero, 360)).toBeGreaterThanOrEqual(64)
      expect(stepPxAt(chassis.type.steps.hero, 1440)).toBeGreaterThanOrEqual(96)
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s keeps every step below base between 11px and 15px, all distinct',
    (_id, chassis) => {
      const values = ['2xs', 'xs', 'sm'].map((s) => chassis.type.steps[s].size)
      expect(new Set(values).size).toBe(3)
      for (const value of values) {
        expect(px(value)).toBeGreaterThanOrEqual(11)
        expect(px(value)).toBeLessThan(15)
      }
    }
  )

  it.each(CHASSIS_CATALOG.map((c) => [c.id, c]))(
    '%s maps every named weight to a weight some font actually loads',
    (_id, chassis) => {
      const loaded = new Set(Object.values(chassis.fonts).flatMap((f) => f.weights))
      for (const name of ['light', 'normal', 'medium', 'semibold', 'bold']) {
        const weight = chassis.type.weights[name]
        expect(weight, `weights.${name}`).toBeDefined()
        expect(loaded.has(weight), `weights.${name}=${weight} is loaded`).toBe(true)
      }
    }
  )
})

describe('renderChassisPresetFile', () => {
  const source = renderChassisPresetFile(TEST_CHASSIS)

  it('pins the body font and leading so rhythm is real, not aspirational', () => {
    expect(source).toContain("body: { fontFamily: 'body', lineHeight: 'normal' }")
  })

  it('puts the body rule under globalCss.extend', () => {
    // Panda merges plain preset globalCss shallowly and the last preset wins
    // the whole selector, so a bare globalCss.body here would delete the Art
    // Director's background and colour along with it.
    const globalCss = source.slice(source.indexOf('globalCss'), source.indexOf('theme:'))
    expect(globalCss).toContain('extend:')
    expect(globalCss.indexOf('extend:')).toBeLessThan(globalCss.indexOf('body:'))
  })

  it('emits the full ramp, quoting the keys that need it', () => {
    expect(source).toContain(`'2xs': { value: "0.75rem" }`)
    expect(source).toContain(`lede: { value: "1.225rem" }`)
    expect(source).toContain(`'5xl': { value: "clamp(4.5rem, 2.667rem + 8.148vw, 10rem)" }`)
    expect(source).toContain(`hero: { value: "clamp(5.063rem, 3.417rem + 7.314vw, 10rem)" }`)
  })

  it('emits every group the chassis now owns', () => {
    expect(source).toContain('fontWeights: {')
    expect(source).toContain('lineHeights: {')
    expect(source).toContain('letterSpacings: {')
    expect(source).toContain('spacing: {')
    expect(source).toContain(`'1': { value: "4px" }`)
    expect(source).toContain(`'9': { value: "128px" }`)
    expect(source).toContain(`bold: { value: "900" }`)
  })

  it('emits the motion keyframes under theme.extend and the reduced-motion rule under globalCss.extend (#506)', () => {
    const extendBlock = source.slice(source.indexOf('theme:'))
    expect(extendBlock).toContain('keyframes: {')
    expect(extendBlock).toContain(
      `settle: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } }`
    )
    expect(extendBlock).toContain(
      `rise: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } }`
    )
    expect(extendBlock).toContain(
      `wipe: { from: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0 0 0)" } }`
    )
    expect(extendBlock).toMatch(/drift: \{ from: \{ transform: "translate3d\(0, 0, 0\)/)
    const globalCss = source.slice(source.indexOf('globalCss'), source.indexOf('theme:'))
    expect(globalCss).toContain(`'@media (prefers-reduced-motion: reduce)': {`)
    // `animationName` leads: it is the only one of the five that reaches a
    // scroll-driven reveal, whose progress comes from scroll position rather
    // than the clock. See REDUCED_MOTION_RULE in scripts/utils/chassis.js.
    expect(globalCss).toContain(
      `'*, *::before, *::after': { animationName: "none !important", animationDuration: "0.01ms !important", animationDelay: "0s !important", animationIterationCount: "1 !important", transitionDuration: "0.01ms !important" },`
    )
    expect(globalCss.indexOf('extend:')).toBeLessThan(globalCss.indexOf('prefers-reduced-motion'))
  })

  it('emits textStyles as a sibling of tokens under theme.extend', () => {
    expect(source).toContain('textStyles: {')
    expect(source).toContain(
      `hero: { value: { fontSize: "hero", lineHeight: "0.95", letterSpacing: "-0.02em" } }`
    )
    const extendBlock = source.slice(source.indexOf('extend:'))
    expect(extendBlock.indexOf('textStyles:')).toBeGreaterThan(extendBlock.indexOf('tokens:'))
  })
})
