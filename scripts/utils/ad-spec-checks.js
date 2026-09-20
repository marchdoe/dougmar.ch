/**
 * Three checks on the Art Director's own reply, run before anything renders.
 *
 * The spec critic used to read every night's reply and log REVISE on twelve of
 * seventeen September nights, and nothing acted on it (#576). Nearly every one
 * of those verdicts was one of three complaints a lookup answers, so the
 * lookups live here and the Art Director gets the answer on its retry:
 *
 * 1. The Color Specification names a hex the preset does not define.
 * 2. `hero_scale` resolves at 1440 to a size no step on the chassis ramp reaches.
 * 3. `hero_step_360` names a step the chassis ramp does not have.
 *
 * Everything compares against what the Art Director is emitting tonight: the
 * preset comes from the reply's own `===FILE:elements/preset.ts===` block and
 * the chassis from its own `===CHASSIS_ID===`, never from the files on disk.
 *
 * Each finding names the field, the value, and what would have been valid, so
 * it can go into the retry brief as it is.
 *
 * @module
 */
import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import { RAMP_STEPS } from '../../elements/chassis/scale.js'
import { WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { stepPxAt } from './chassis.js'
import { heroPxAt } from './mockup-rounds.js'
import { parsePreset } from './preset-parser.js'

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b/gi

/** A numbered section heading in the visual spec: `### 1. Color` or `**1. Color**`. */
const SECTION_HEADING = /^\s*(?:#{1,4}\s+|\*\*)\d+\.\s/
const COLOR_HEADING = /colou?r/i

/** The most offending hexes a finding lists before it says how many more. */
const MAX_LISTED = 6

/**
 * How far a spec hex may sit from a preset colour and still count as that
 * colour, as a straight distance in RGB. The Art Director writes the spec's
 * ramp and the preset's ramp one after the other and drifts by a digit or two
 * (#f4b48e in the spec, #f2b092 in the preset: 4.9), which the engineer's
 * nearest-token rule absorbs without a trace. A colour that was meant to be
 * something else is 15 or more away on every night this was replayed against.
 */
const NEAR_ENOUGH = 6

/**
 * How far over the ramp's biggest step `hero_scale` may resolve before it
 * counts as unrenderable. On 2026-09-10 and 09-14 the Art Director declared
 * 172.8px against a table that showed a 177px hero; the 10rem cap (#530) has
 * since moved that ceiling to 160px, 8% under the declaration, and a figure
 * copied from the table it was shown is not what this catches. The
 * declarations that shipped a smaller hero than the mockup drew (300px on
 * 09-15, shipped at 120px; 340px on 09-16, shipped at 177px) were nearly
 * double the ceiling as it stands now.
 */
const HERO_SLACK = 1.1

/** `#abc` -> `#aabbcc`; `#rrggbbaa` -> `#rrggbb`. Alpha never separates two colours. */
function normalizeHex(hex) {
  let digits = hex.slice(1).toLowerCase()
  if (digits.length === 3) digits = [...digits].map((c) => c + c).join('')
  return `#${digits.slice(0, 6)}`
}

function hexesIn(text) {
  return [...String(text).matchAll(HEX)].map((m) => normalizeHex(m[0]))
}

/**
 * The part of the visual spec that defines the palette. The other sections
 * mention colours in passing (a team's navy in Signal Integration, a stroke in
 * Component Character) and those are prose about the page, not tokens the
 * engineer has to find. A spec with no colour heading is read whole.
 *
 * @param {string} visualSpec
 * @returns {string}
 */
export function colorSection(visualSpec) {
  const kept = []
  let sawColor = false
  let inColor = false
  for (const line of String(visualSpec).split('\n')) {
    if (SECTION_HEADING.test(line)) {
      inColor = COLOR_HEADING.test(line)
      sawColor ||= inColor
    }
    if (inColor) kept.push(line)
  }
  return sawColor ? kept.join('\n') : String(visualSpec)
}

/**
 * Every hex the preset defines, keyed by normalized value, with the token it
 * lives at for the message. Reads the parsed `theme` block so a hex in a
 * comment does not count; when the block will not parse, falls back to every
 * hex in the source rather than reject a preset codegen may still accept.
 *
 * @param {string} presetTs
 * @returns {Map<string, string>}
 */
export function presetColors(presetTs) {
  const found = new Map()
  const walk = (node, path) => {
    if (typeof node === 'string') {
      for (const hex of hexesIn(node)) if (!found.has(hex)) found.set(hex, path.join('.'))
    } else if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) walk(child, [...path, key])
    }
  }
  try {
    walk(parsePreset(presetTs), [])
  } catch {
    for (const hex of hexesIn(presetTs)) if (!found.has(hex)) found.set(hex, 'preset')
  }
  return found
}

function rgb(hex) {
  return [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
}

function distance(a, b) {
  const [x, y] = [rgb(a), rgb(b)]
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}

function nearest(hex, defined) {
  let best = null
  for (const candidate of defined.keys()) {
    if (!best || distance(hex, candidate) < distance(hex, best)) best = candidate
  }
  return best
}

/**
 * Check 1. Hexes in the Color Specification that the preset does not define,
 * each with the closest one it does.
 *
 * Skipped when the preset defines no hex at all (a preset written in another
 * colour syntax has nothing to compare against, and every spec hex would
 * fail).
 *
 * @param {string} visualSpec
 * @param {string} presetTs
 * @returns {string[]} zero or one finding
 */
export function undefinedSpecHexes(visualSpec, presetTs) {
  const defined = presetColors(presetTs)
  if (defined.size === 0) return []
  const missing = []
  for (const hex of new Set(hexesIn(colorSection(visualSpec)))) {
    const near = nearest(hex, defined)
    if (distance(hex, near) > NEAR_ENOUGH) missing.push({ hex, near })
  }
  if (missing.length === 0) return []
  const listed = missing
    .slice(0, MAX_LISTED)
    .map(({ hex, near }) => `${hex} (closest in the preset: ${near} at ${defined.get(near)})`)
  const more = missing.length > MAX_LISTED ? `, and ${missing.length - MAX_LISTED} more` : ''
  return [
    `the Color Specification in ===VISUAL_SPEC=== names ${listed.join(', ')}${more}, which ===FILE:elements/preset.ts=== does not define. ` +
      'The engineer renders the preset, so every colour the spec names has to be one it defines: write the preset value in the spec, or add the colour to the preset.',
  ]
}

/**
 * The largest size any step on the ramp reaches at 1440, and which step.
 * `hero` and `5xl` are the two ends of the display register the Art Director
 * is shown; the rest of the ramp sits under them, but the whole ramp is read
 * so a chassis that overrides its steps is measured as it is.
 *
 * @returns {{ px: number, step: string }|null}
 */
export function rampCeiling(chassis) {
  const steps = chassis?.type?.steps
  if (!steps) return null
  let top = null
  for (const step of RAMP_STEPS) {
    if (!steps[step]?.size) continue
    const px = stepPxAt(steps[step], WIDE_VIEWPORT.width)
    if (!top || px >= top.px) top = { px, step }
  }
  return top
}

/**
 * Check 2. A `hero_scale` that resolves at 1440 to more than the chassis's
 * biggest step. `hero_scale` sizes the object the composition names, and the
 * ramp is the only sizes the chassis carries; a declaration above it asks the
 * engineer for a poster the type system cannot set.
 *
 * A `hero_scale` in a form `heroPxAt` cannot resolve (calc, min, max) is
 * skipped rather than guessed at.
 *
 * @param {string|null|undefined} heroScale
 * @param {object|null} chassis
 * @param {object[]} [catalog] the chassis to offer instead
 * @returns {string[]} zero or one finding
 */
export function unrenderableHeroScale(heroScale, chassis, catalog = CHASSIS_CATALOG) {
  const declared = heroPxAt(heroScale)
  const ceiling = rampCeiling(chassis)
  if (declared === null || !ceiling || declared <= ceiling.px * HERO_SLACK) return []
  const reach = catalog
    .filter((c) => (rampCeiling(c)?.px ?? 0) * HERO_SLACK >= declared)
    .map((c) => c.id)
  const options = reach.length
    ? `Lower hero_scale to ${ceiling.px}px or under, or pick a chassis whose ramp reaches ${Math.round(declared)}px: ${reach.join(', ')}.`
    : `Lower hero_scale to ${ceiling.px}px or under; no chassis in the catalog reaches ${Math.round(declared)}px.`
  return [
    `MEASURABLES hero_scale "${heroScale}" resolves to ${Math.round(declared)}px at ${WIDE_VIEWPORT.width}px, and chassis ${chassis.id} tops out at ${ceiling.px}px there (its ${ceiling.step} step). ${options}`,
  ]
}

/**
 * Check 3. A `hero_step_360` the chassis ramp does not have.
 *
 * `isValidMobile` already limits the field to five step names, and every
 * chassis in the catalog carries the whole ramp, so this cannot fire today.
 * It reads the chassis's own table, so a chassis authored with a partial
 * ramp is caught here instead of at codegen.
 *
 * @param {string|null|undefined} step
 * @param {object|null} chassis
 * @returns {string[]} zero or one finding
 */
export function heroStepOffRamp(step, chassis) {
  const steps = chassis?.type?.steps
  if (!step || !steps || steps[step]?.size) return []
  return [
    `MOBILE hero_step_360 "${step}" is not a step on the ${chassis.id} ramp (it has: ${Object.keys(steps).join(', ')}). Pick one of those.`,
  ]
}

/**
 * Run the three checks over a parsed Art Director reply's declarations.
 *
 * @param {{ visualSpec: string, presetTs: string, chassisId: string, measurables: { hero_scale?: string|null }, mobile: { hero_step_360?: string|null } }} reply
 * @param {object[]} [catalog]
 * @returns {string[]} one finding per failed check
 */
export function specFindings(reply, catalog = CHASSIS_CATALOG) {
  const chassis = catalog.find((c) => c.id === reply.chassisId) ?? null
  return [
    ...undefinedSpecHexes(reply.visualSpec, reply.presetTs),
    ...unrenderableHeroScale(reply.measurables.hero_scale, chassis, catalog),
    ...heroStepOffRamp(reply.mobile.hero_step_360, chassis),
  ]
}
