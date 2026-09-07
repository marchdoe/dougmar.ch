/**
 * The mobile grammar: the `===MOBILE===` block's vocabulary and validation.
 *
 * The composition tuple describes one canvas, and every measurable that
 * checks it is anchored at 1440x900. Nothing asked what the idea became at
 * one column, so on 2026-09-04 a question facing its answer across a split
 * shipped with the split gone at 360: the answer panel faced nothing, and
 * what reached the phone was five lines of oversized mono followed by a
 * paragraph. Every automatic check passed (#452).
 *
 * So the phone gets the treatment the header got in #254: a declared set of
 * values the designer must render and a critic can judge against the 360
 * image. The `collapse` axis in the composition tuple names the strategy;
 * this block carries what the strategy means for today's page. `carrier`,
 * `first_fold`, `order` and `nav_360` stay prose, because what carries an
 * idea is not a number, but each is required and `order` has to be a real
 * list. `hero_step_360` is the one enumerated field.
 *
 * @module
 */

/** Field names in canonical order. */
export const MOBILE_FIELD_NAMES = ['carrier', 'first_fold', 'order', 'hero_step_360', 'nav_360']

/**
 * Ramp steps the hero may be set at on a phone. `hero` and the four fluid
 * display steps (#457) all compress toward 360; anything below `2xl` is a
 * fixed size and a hero set there is a heading, not a hero.
 */
export const HERO_STEPS_360 = ['hero', '5xl', '4xl', '3xl', '2xl']

/** Fewer zones than this is not an order, it is a single block. */
const MIN_ORDER_ZONES = 2

/**
 * `collapse` values that promise a rail or sidebar turned into a band, and
 * which compositions actually had one to turn. A `marginal` posture puts the
 * nav in a rail; `two-asymmetric` columns make the narrow one a margin that
 * holds content. A `left-rail` or `right-margin` header placement is the
 * same rail declared from the header's side.
 */
export const RAIL_POSTURES = ['marginal']
export const RAIL_COLUMNS = ['two-asymmetric']
export const RAIL_PLACEMENTS = ['left-rail', 'right-margin']

/**
 * Does the first-fold line name the hero phrase?
 *
 * Accepts the phrase itself (whitespace and case folded), its first three
 * words, or the word "hero", so "the hero phrase at hero step" counts as
 * much as quoting the line does.
 *
 * @param {string|null|undefined} firstFold
 * @param {string|null|undefined} heroCopy
 * @returns {boolean}
 */
export function namesHero(firstFold, heroCopy) {
  const fold = normalize(firstFold)
  if (!fold) return false
  if (/\bhero\b/.test(fold)) return true
  const hero = normalize(heroCopy)
  if (!hero) return false
  if (fold.includes(hero)) return true
  const opening = hero.split(' ').slice(0, 3).join(' ')
  return opening.length >= 6 && fold.includes(opening)
}

/**
 * Does the first-fold line say the hero sits below the fold?
 * @param {string|null|undefined} firstFold
 * @returns {boolean}
 */
export function heroBelowFold(firstFold) {
  return /\bbelow\b[^.]*\bfold\b|\bunder\b[^.]*\bfold\b/.test(normalize(firstFold))
}

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Split a comma-separated `order` line into zone names.
 * @param {string|null|undefined} order
 * @returns {string[]}
 */
export function parseOrder(order) {
  return String(order ?? '')
    .split(',')
    .map((z) => z.trim())
    .filter(Boolean)
}

/**
 * Validate a parsed MOBILE block against the composition it belongs to.
 *
 * The consistency rules are the point: a `collapse` that promises one thing
 * and a block that describes another is rejected the way a HEADER placement
 * that contradicts `shell_posture` is, not reconciled.
 *
 * @param {Record<string, string|null>} mobile parseMobileBlock output
 * @param {{ collapse?: string|null, shellPosture?: string|null, columns?: string|null, placement?: string|null, heroCopy?: string|null }} [context]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidMobile(mobile, context = {}) {
  if (!mobile || typeof mobile !== 'object' || Array.isArray(mobile)) {
    return { valid: false, errors: ['mobile must be an object of field → value'] }
  }
  const errors = [
    ...missingFields(mobile),
    ...heroStepErrors(mobile.hero_step_360),
    ...orderErrors(mobile.order),
    ...firstFoldErrors(mobile.first_fold, context),
  ]
  return { valid: errors.length === 0, errors }
}

/** @returns {string[]} one error per required field that is absent or blank */
function missingFields(mobile) {
  return MOBILE_FIELD_NAMES.filter((field) => {
    const value = mobile[field]
    return value === undefined || value === null || String(value).trim() === ''
  }).map((field) => `missing field: ${field}`)
}

/** @returns {string[]} */
function heroStepErrors(step) {
  if (!step || HERO_STEPS_360.includes(step)) return []
  return [`invalid hero_step_360: "${step}" (expected one of: ${HERO_STEPS_360.join(', ')})`]
}

/** @returns {string[]} */
function orderErrors(order) {
  if (!order) return []
  const zones = parseOrder(order)
  if (zones.length >= MIN_ORDER_ZONES) return []
  return [
    `order names ${zones.length} zone${zones.length === 1 ? '' : 's'}; at least ${MIN_ORDER_ZONES} are needed, comma-separated, top to bottom`,
  ]
}

/**
 * The hero must be accounted for in the first fold, and the `collapse`
 * strategy must agree with what the fold and the composition say.
 * @returns {string[]}
 */
function firstFoldErrors(firstFold, context) {
  if (!firstFold) return []
  const fold = { named: namesHero(firstFold, context.heroCopy), below: heroBelowFold(firstFold) }
  const errors = []
  if (!fold.named && !fold.below) {
    errors.push(
      'first_fold must name the hero phrase, or say in one clause why the hero is deliberately below the fold'
    )
  }
  const rule = COLLAPSE_RULES[context.collapse ?? '']
  if (rule) errors.push(...rule(context, fold))
  return errors
}

/** Did anything at 1440 stand as a rail or sidebar? */
export function hadRail(context) {
  return (
    RAIL_POSTURES.includes(context.shellPosture ?? '') ||
    RAIL_COLUMNS.includes(context.columns ?? '') ||
    RAIL_PLACEMENTS.includes(context.placement ?? '')
  )
}

/**
 * The per-strategy contradictions between `collapse` and the block or the
 * rest of the composition. `stack` and `reorder` promise nothing the rest of
 * the composition can contradict, so they have no rule.
 *
 * Each rule takes the validation context and what first_fold said about the
 * hero, and returns the errors it found.
 *
 * @type {Record<string, (context: {shellPosture?: string|null, columns?: string|null, placement?: string|null}, fold: {named: boolean, below: boolean}) => string[]>}
 */
export const COLLAPSE_RULES = {
  'hero-only': (_context, fold) =>
    fold.named && !fold.below
      ? []
      : [
          'collapse "hero-only" contradicts first_fold: the first fold must be the hero alone, so first_fold has to name the hero and cannot put it below the fold',
        ],
  'rail-to-band': (context) =>
    hadRail(context)
      ? []
      : [
          `collapse "rail-to-band" contradicts the composition: nothing at 1440 was a rail (shell_posture "${context.shellPosture}", columns "${context.columns}"; a rail is shell_posture ${RAIL_POSTURES.join('/')}, columns ${RAIL_COLUMNS.join('/')}, or a ${RAIL_PLACEMENTS.join('/')} header)`,
        ],
  'split-to-sequence': (context) =>
    context.columns === 'single'
      ? [
          'collapse "split-to-sequence" contradicts columns "single": there is no split field to turn into a sequence',
        ]
      : [],
}

/**
 * Render a mobile declaration as the `===MOBILE===` block body, the same
 * `key: value` shape the Art Director emits, so what we send downstream and
 * what we parse back are one format.
 *
 * @param {Record<string, string|null>} mobile
 * @returns {string}
 */
export function formatMobile(mobile) {
  return MOBILE_FIELD_NAMES.map((field) => `${field}: ${mobile?.[field] ?? '?'}`).join('\n')
}
