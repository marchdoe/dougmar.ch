/**
 * Step-table generator for the chassis catalog.
 *
 * A chassis used to carry `scale: { ratio, base }` and the ramp was computed
 * at build time — one ratio, no per-step leading, no tracking, no record of
 * what the numbers actually are. Now each chassis stores an explicit table:
 * every step declares `size`, `lineHeight` and `tracking`, and the file is
 * the artifact a reviewer reads (#253).
 *
 * `scaleSteps(ratio, base, overrides)` keeps authoring cheap. It generates
 * the same sizes the old math produced — chassis ratio above `base`, a fixed
 * minor second below it (#252) — plus defaults for leading and tracking, and
 * the author lays face-specific overrides on top. A condensed caps face wants
 * different hero tracking than a didone; that difference lives in the chassis
 * file, not in a global constant.
 *
 * Defaults, and why:
 * - Leading tightens as size grows: body reads at 1.5, headlines at 1.1,
 *   the hero near 0.95. Big type with body leading floats apart.
 * - Tracking opens below `base` (small type needs air) and closes above it
 *   (display type sets tighter than the font's built-in spacing).
 * - `hero` is a clamp from the desktop `2xl` at a 360px viewport to the
 *   desktop `3xl` at 1440px, floored so every chassis reaches marquee: the
 *   minimum never drops below 4rem (64px, the mockup critic's mobile floor)
 *   and the maximum never drops below 1.5x the minimum. On a 1.5-ratio
 *   chassis the floor is inert and the clamp is identical to the pre-table
 *   one; on a 1.333 chassis it lifts the hero from 50.5px to a real
 *   64px-to-96px range, which is the undershoot #257 found and left for
 *   #253.
 * - `xl` through `5xl` are clamps too (#457, then `xl` in #469). Each keeps
 *   its geometric value as the 1440px maximum, so desktop is untouched, and
 *   interpolates down to a compressed 360px minimum. See NARROW_MAX_REM
 *   below for why they had to move: a fixed 5xl is 273px on a 1.5-ratio
 *   chassis, which is most of a 360px viewport before the first character
 *   is drawn.
 * - Nothing tops out above 10rem. See DESKTOP_MAX_REM below: the geometric
 *   value is the 1440px maximum only until it reaches the ceiling, so the top
 *   of a steep ramp goes flat instead of running to 464px.
 */

/** The ramp, small to large. Order matters: it is the emission order. */
export const RAMP_STEPS = [
  '2xs',
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  'hero',
]

/** Steps above `base`, nearest first. Each is one chassis-ratio step out. */
const UP_STEPS = ['md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

/** Steps below `base`, nearest first, on a fixed minor second (#252). */
const DOWN_STEPS = ['sm', 'xs', '2xs']
const SMALL_RATIO = 1.125

/** The viewport window `fluid()` interpolates across, in rem. */
const FLUID_MIN_VW_REM = 22.5 // 360px
const FLUID_MAX_VW_REM = 90 // 1440px

/** The hero floor: 4rem is the mockup critic's 64px mobile minimum. */
const HERO_MIN_REM = 4
const HERO_SPAN = 1.5

/** The display steps that run fluid, nearest `lg` first. `lg` and below stay
 *  fixed: `lg` is 28-42px across the catalog, sizes a 360px column carries
 *  with room to spare. `xl` used to be the last fixed step, but at 68px on a
 *  1.618 chassis it sat at 94% of the narrow ceiling and left the four steps
 *  above it within 1.5% of each other at 360 (#469). */
const FLUID_STEPS = ['xl', '2xl', '3xl', '4xl', '5xl']

/** The last fixed step, the one the compressed narrow ramp climbs from. */
const NARROW_ANCHOR_STEP = 'lg'

/**
 * The largest display size a 360px viewport can carry, in rem.
 *
 * Measured rather than guessed. On the canary that #457 was filed against,
 * an eight-character project name ("Spaceman") set at 89.8px measured 388px
 * wide inside a 317px content column — 0.54em of advance per character. A
 * 317px column therefore affords about 73px of type; 4.5rem (72px) sets an
 * eight-character word in 311px and leaves the rest as slack.
 */
const NARROW_MAX_REM = 4.5

/**
 * The largest size any step may reach at 1440px, in rem.
 *
 * The ramp is geometric with nothing above it, so the top steps grow with the
 * ratio's seventh power: `5xl` is 17.086rem (273px) on a 1.5 chassis and
 * 29.03rem (464px) on a 1.618 one. At 273px the project titles on 2026-09-20
 * broke mid-word inside their columns (#530). The hero already tops out near
 * `3xl`, 6rem to 11.1rem across the catalog, and 10rem (160px) sits at the
 * loud end of that range. Only the 1.618 hero was over it, by 17px.
 *
 * Applied to the finished table, after overrides, so a chassis that declares
 * its own `fluid(min, max)` or a bare rem is held to the same ceiling. Steps
 * past the ceiling share it: `4xl` and `5xl` are both 10rem at 1440 on a 1.5
 * chassis, and `3xl` and the hero join them on 1.618. They still differ below
 * 1440, because each keeps its own 360px minimum.
 */
const DESKTOP_MAX_REM = 10

/**
 * Floor for the compressed narrow-end ratio. Purely an inversion guard for a
 * chassis whose fixed `lg` already sits at the narrow ceiling — it keeps the
 * ramp strictly ascending at 360 instead of flat or reversed. Inert for every
 * chassis in the catalog.
 */
const NARROW_MIN_RATIO = 1.01

const DEFAULT_LINE_HEIGHTS = {
  '2xs': 1.4,
  xs: 1.4,
  sm: 1.45,
  base: 1.5,
  md: 1.4,
  lg: 1.3,
  xl: 1.2,
  '2xl': 1.1,
  '3xl': 1.05,
  '4xl': 1,
  '5xl': 0.95,
  hero: 0.95,
}

const DEFAULT_TRACKING = {
  '2xs': '0.04em',
  xs: '0.03em',
  sm: '0.01em',
  base: '0',
  md: '0',
  lg: '-0.005em',
  xl: '-0.01em',
  '2xl': '-0.015em',
  '3xl': '-0.02em',
  '4xl': '-0.02em',
  '5xl': '-0.025em',
  hero: '-0.02em',
}

function parseRem(value) {
  const match = /^([\d.]+)rem$/.exec(value)
  if (!match) throw new Error(`expected a rem value, got: ${value}`)
  return parseFloat(match[1])
}

function roundRem(n) {
  return Math.round(n * 1000) / 1000
}

/**
 * A clamp whose middle term is the straight line through (360px, min) and
 * (1440px, max). Bare sums are legal inside clamp(), so no calc() wrapper.
 *
 * Exported so a chassis can declare its own fluid display steps:
 * `hero: { size: fluid('4rem', '6.5rem') }`.
 *
 * @param {string} min rem value at a 360px viewport
 * @param {string} max rem value at a 1440px viewport
 * @returns {string}
 */
export function fluid(min, max) {
  const minRem = parseRem(min)
  const maxRem = parseRem(max)
  const slope = (maxRem - minRem) / (FLUID_MAX_VW_REM - FLUID_MIN_VW_REM)
  const intercept = roundRem(minRem - slope * FLUID_MIN_VW_REM)
  const vw = roundRem(slope * 100)
  return `clamp(${roundRem(minRem)}rem, ${intercept}rem + ${vw}vw, ${roundRem(maxRem)}rem)`
}

function clamp(min, value, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * A display step's size: a clamp from its compressed 360px value to its
 * geometric 1440px one, or the plain rem when the two round to the same
 * number. A chassis gentle enough that its whole ramp already fits a 360px
 * column (the compressed ratio is capped at the chassis ratio, so it can
 * never expand) needs no clamp, and emitting `clamp(x, x + 0vw, x)` would
 * only make the preset harder to read.
 */
function fluidStepSize(step, narrowRem, fixedRem) {
  const min = roundRem(narrowRem)
  const max = roundRem(fixedRem)
  if (!FLUID_STEPS.includes(step) || min >= max) return `${max}rem`
  return fluid(`${min}rem`, `${max}rem`)
}

/**
 * Hold a finished size to DESKTOP_MAX_REM. Reads the two forms the schema
 * allows, a rem or a `clamp()` ending in its 1440px rem, and rebuilds the
 * clamp from its own minimum when the maximum is over. A minimum already at
 * the ceiling leaves nothing to interpolate, so that emits the plain rem.
 */
function capSize(size) {
  const clampMatch = /^clamp\(([\d.]+)rem,.*,\s*([\d.]+)rem\)$/.exec(size)
  const maxRem = clampMatch ? Number(clampMatch[2]) : parseRem(size)
  if (maxRem <= DESKTOP_MAX_REM) return size
  const minRem = clampMatch ? Number(clampMatch[1]) : maxRem
  if (minRem >= DESKTOP_MAX_REM) return `${DESKTOP_MAX_REM}rem`
  return fluid(`${minRem}rem`, `${DESKTOP_MAX_REM}rem`)
}

/**
 * Generate a full step table from a ratio and a base size, then lay
 * per-step overrides on top.
 *
 * @param {number} ratio modular ratio for the display end (`md` through `5xl`)
 * @param {string} base body size as a rem string, e.g. '1rem'
 * @param {Partial<Record<string, {size?: string, lineHeight?: number, tracking?: string}>>} [overrides]
 *   per-step patches; each step merges field by field over the generated one
 * @returns {Record<string, {size: string, lineHeight: number, tracking: string}>}
 */
export function scaleSteps(ratio, base, overrides = {}) {
  const baseRem = parseRem(base)

  const rems = { base: baseRem }
  DOWN_STEPS.forEach((step, i) => {
    rems[step] = baseRem / SMALL_RATIO ** (i + 1)
  })
  UP_STEPS.forEach((step, i) => {
    rems[step] = baseRem * ratio ** (i + 1)
  })

  const heroMin = Math.max(rems['2xl'], HERO_MIN_REM)
  const heroMax = Math.max(rems['3xl'], heroMin * HERO_SPAN)

  // The narrow end of the display ramp. `xl`..`5xl` keep their geometric
  // values at 1440 and interpolate down to a ramp that is compressed rather
  // than re-based: it starts where the fixed `lg` step leaves off and climbs
  // on a smaller ratio, the fix Cloud Four recommends for a fixed scale that
  // has to survive a narrow column. The compressed ratio is derived, not
  // picked — it is whatever lands `5xl` on the narrow ceiling in five steps.
  //
  // The ceiling is the lower of two limits. The hero's own 360px size, because
  // the marquee is the loudest thing on the page and no other step has any
  // business out-shouting it on a phone; and NARROW_MAX_REM, because a 360px
  // column only fits so many characters however loud the chassis wants to be.
  // Whichever binds, `5xl` at 360 lands exactly on it and the four steps
  // below fall out geometrically.
  const narrowTop = Math.min(heroMin, NARROW_MAX_REM)
  const anchorRem = rems[NARROW_ANCHOR_STEP]
  const narrowRatio = clamp(
    NARROW_MIN_RATIO,
    (narrowTop / anchorRem) ** (1 / FLUID_STEPS.length),
    ratio
  )
  const narrowRems = {}
  FLUID_STEPS.forEach((step, i) => {
    narrowRems[step] = anchorRem * narrowRatio ** (i + 1)
  })

  const steps = {}
  for (const step of RAMP_STEPS) {
    const size =
      step === 'hero'
        ? fluid(`${roundRem(heroMin)}rem`, `${roundRem(heroMax)}rem`)
        : fluidStepSize(step, narrowRems[step], rems[step])
    steps[step] = {
      size,
      lineHeight: DEFAULT_LINE_HEIGHTS[step],
      tracking: DEFAULT_TRACKING[step],
      ...(overrides[step] || {}),
    }
    steps[step].size = capSize(steps[step].size)
  }

  for (const step of Object.keys(overrides)) {
    if (!RAMP_STEPS.includes(step)) {
      throw new Error(`scaleSteps override names unknown step "${step}"`)
    }
  }

  return steps
}
