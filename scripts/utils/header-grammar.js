/**
 * The header grammar — the `===HEADER===` block's vocabulary and validation.
 *
 * The header used to be one line of prose inside `===SHELL===`: `nav: <treatment>`.
 * Nothing downstream could check prose, so the critics judged the header off a
 * full-page screenshot at 1440, where an 11px mark reads as "present" and a
 * 44px one reads the same. Three owner ratings running said the header was
 * wrong; nothing in the pipeline could have caught any of them (#254).
 *
 * So the header gets the same treatment the page structure got: a declared
 * tuple of values a critic can measure off a crop. `nav` keeps its prose,
 * because the character of a nav is not a number — everything beside it is one.
 *
 * @module
 */

import { RAMP_STEPS as CHASSIS_RAMP_STEPS } from '../../elements/chassis/scale.js'
import { LOCKUP_VARIANTS } from './brand-lockup.js'

/**
 * Ramp steps a header field may name.
 *
 * These are the steps buildFontSizes emits (scripts/utils/chassis.js), minus
 * `hero`. `hero` is a viewport clamp built to carry a headline across a
 * 360px-1440px window; a nav link or a wordmark set in it would be several
 * hundred pixels tall, so it is not something a header may declare. Read
 * from elements/chassis/scale.js's own `RAMP_STEPS` so the two lists cannot
 * drift the way they did before #318.
 */
export const RAMP_STEPS = CHASSIS_RAMP_STEPS.filter((s) => s !== 'hero')

/**
 * The enumerated header fields. `nav`, `height_px` and `mark_px` are not here:
 * the first is prose, the other two are numbers with their own rules.
 *
 * @type {Record<string, string[]>}
 */
export const HEADER_FIELDS = {
  placement: [
    'top-bar',
    'left-rail',
    'right-margin',
    'corner',
    'folded-into-hero',
    'footer-only',
    'none',
  ],
  wordmark_step: [...RAMP_STEPS, 'none'],
  role_line: ['present', 'absent'],
  nav_step: RAMP_STEPS,
  nav_case: ['upper', 'lower', 'small-caps', 'title'],
  // What shape the links take (#501). Eight builds running set "work, about,
  // contact" as three small-caps labels; the case was declared, the form
  // never was. `labels` is that row; `numbered` prefixes 01 02 03; `sentence`
  // runs the links inside one sentence; `list` is a vertical index with a
  // rule per row; `word` is a single "Menu" or "Index" that reveals them.
  nav_form: ['labels', 'numbered', 'sentence', 'list', 'word'],
}

/** Field names in canonical order, enumerated and numeric together. */
export const HEADER_FIELD_NAMES = [
  'placement',
  'height_px',
  'mark_px',
  'wordmark_step',
  'wordmark_weight',
  'role_line',
  'nav_step',
  'nav_case',
  'nav_form',
  'nav',
]

/**
 * Which placements each `shell_posture` admits. The two fields describe the
 * same thing from different heights — posture says what kind of chrome the
 * page has, placement says where it physically sits — so a `shell_posture:
 * none` day with a `top-bar` header is a contradiction, not a choice.
 *
 * @type {Record<string, string[]>}
 */
export const PLACEMENT_BY_POSTURE = {
  standard: ['top-bar', 'left-rail', 'right-margin', 'corner'],
  marginal: ['left-rail', 'right-margin', 'corner'],
  none: ['none'],
  'folded-into-hero': ['folded-into-hero'],
  'footer-only': ['footer-only'],
}

/** A header this tall is not a header. */
const MIN_HEIGHT_PX = 32
/** Past this it is a hero with a wordmark in it, and `folded-into-hero` says so. */
const MAX_HEIGHT_PX = 800

/**
 * Validate a parsed HEADER block.
 *
 * @param {Record<string, string|number|null>} header parseHeaderBlock output
 * @param {{ shellPosture?: string|null, brandLockup?: string|null }} [context]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidHeader(header, context = {}) {
  const errors = []
  if (!header || typeof header !== 'object' || Array.isArray(header)) {
    return { valid: false, errors: ['header must be an object of field → value'] }
  }

  for (const [field, allowed] of Object.entries(HEADER_FIELDS)) {
    const value = header[field]
    if (value === undefined || value === null || value === '') {
      errors.push(`missing field: ${field}`)
    } else if (!allowed.includes(value)) {
      errors.push(`invalid ${field}: "${value}" (expected one of: ${allowed.join(', ')})`)
    }
  }

  const placement = header.placement
  const noHeader = placement === 'none'

  if (typeof header.height_px !== 'number') {
    errors.push('missing numeric height_px')
  } else if (noHeader && header.height_px !== 0) {
    errors.push(`height_px must be 0 when placement is none, got ${header.height_px}`)
  } else if (!noHeader && (header.height_px < MIN_HEIGHT_PX || header.height_px > MAX_HEIGHT_PX)) {
    errors.push(
      `height_px ${header.height_px} is outside ${MIN_HEIGHT_PX}–${MAX_HEIGHT_PX}px — a header shorter than ${MIN_HEIGHT_PX}px is not a header, and one taller than ${MAX_HEIGHT_PX}px is a hero`
    )
  }

  // mark_px is checked against the band the declared lockup publishes, so the
  // number the critic measures against is one the component can actually
  // render — BrandLockup clamps the mark to the same band.
  const band = context.brandLockup ? LOCKUP_VARIANTS[context.brandLockup] : null
  if (typeof header.mark_px !== 'number') {
    errors.push('missing numeric mark_px')
  } else if (band && (header.mark_px < band.markMinPx || header.mark_px > band.markMaxPx)) {
    errors.push(
      `mark_px ${header.mark_px} is outside the ${context.brandLockup} band (${band.markMinPx}–${band.markMaxPx}px)`
    )
  }

  if (typeof header.wordmark_weight !== 'number') {
    errors.push('missing numeric wordmark_weight')
  } else if (header.wordmark_weight < 100 || header.wordmark_weight > 900) {
    errors.push(`wordmark_weight ${header.wordmark_weight} is outside 100–900`)
  }

  const posture = context.shellPosture
  if (posture && PLACEMENT_BY_POSTURE[posture] && placement) {
    const admitted = PLACEMENT_BY_POSTURE[posture]
    if (!admitted.includes(placement)) {
      errors.push(
        `placement "${placement}" contradicts shell_posture "${posture}" (expected one of: ${admitted.join(', ')})`
      )
    }
  }

  // A mark-only lockup has no wordmark, so a step for it is a claim about
  // something that isn't on the page.
  const lockup = context.brandLockup
  if (lockup && LOCKUP_VARIANTS[lockup]) {
    const markOnly = LOCKUP_VARIANTS[lockup].orientation === 'mark'
    if (markOnly && header.wordmark_step && header.wordmark_step !== 'none') {
      errors.push(`wordmark_step must be none for ${lockup} — that lockup has no wordmark`)
    }
    if (!markOnly && header.wordmark_step === 'none') {
      errors.push(`wordmark_step must be a ramp step for ${lockup} — that lockup has a wordmark`)
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Render a header declaration as the `===HEADER===` block body — the same
 * `key: value` shape the Art Director emits, so what we send downstream and
 * what we parse back are one format.
 *
 * @param {Record<string, string|number|null>} header
 * @returns {string}
 */
export function formatHeader(header) {
  return HEADER_FIELD_NAMES.map((field) => `${field}: ${header?.[field] ?? '?'}`).join('\n')
}
