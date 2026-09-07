/**
 * The composition grammar — nine independent axes the Art Director
 * composes from, replacing the fixed eight-name archetype shortlist.
 *
 * The archetype Set gave the pipeline exactly 8 silhouettes, so one
 * recurred every ~8 days; the 2026-08-23 audit of 122 archived builds found
 * even rotation across all eight and an owner rating calling the output
 * "still cycling through 4 or 5 different templates". Naming a silhouette
 * also fused two unrelated decisions: what the page's structure is, and
 * what its aesthetic register is. Here they are separate — this module owns
 * structure, `scripts/prompts/lanes/` owns register.
 *
 * Values are compositional, not stylistic: nothing here names a typeface, a
 * palette, or a mood. An axis value must be something you could measure off
 * a screenshot.
 *
 * The first eight axes describe one canvas at 1440. `collapse` (#452) says
 * what that canvas becomes at 360, where half the audience meets it: the
 * 2026-09-04 build was a question on a dark panel facing its answer on a
 * terracotta panel, and at one column the split was gone, the answer faced
 * nothing, and there was no design left. The value is measurable off the
 * phone render the same way the others are off the desktop one, and the
 * `===MOBILE===` block (utils/mobile-grammar.js) carries the specifics.
 *
 * @module
 */

/**
 * The axes and their permitted values. 6·4·5·6·4·4·5·4·5 = 1,152,000 tuples.
 *
 * Order matters only for display — tuples are keyed objects, never
 * positional arrays, so adding an axis later doesn't shift anything.
 *
 * @type {Record<string, string[]>}
 */
export const COMPOSITION_AXES = {
  columns: ['single', 'two-asymmetric', 'two-equal', 'three', 'irregular-twelve', 'masonry'],
  axis: ['vertical', 'horizontal', 'diagonal', 'radial'],
  symmetry: ['symmetric', 'left-weighted', 'right-weighted', 'broken', 'mirrored'],
  hero_zone: ['full-bleed', 'upper-left', 'center', 'lower-third', 'edge-bound', 'interleaved'],
  density: ['sparse', 'measured', 'dense', 'crowded'],
  rhythm: ['even', 'accelerating', 'syncopated', 'interrupted'],
  shell_posture: ['standard', 'marginal', 'none', 'folded-into-hero', 'footer-only'],
  field_ratio: ['type-dominant', 'balanced', 'field-dominant', 'drenched'],
  collapse: ['stack', 'reorder', 'hero-only', 'rail-to-band', 'split-to-sequence'],
}

/** Axis names in canonical order. @type {string[]} */
export const AXIS_NAMES = Object.keys(COMPOSITION_AXES)

/**
 * One sentence per axis value, written for the Art Director. This prose is
 * what replaces the 5–8KB of canned archetype mechanics the seed files used
 * to supply: enough to make the value actionable, short enough that nine of
 * them together read as a brief rather than a template.
 *
 * @type {Record<string, Record<string, string>>}
 */
const AXIS_VALUE_DESCRIPTIONS = {
  columns: {
    single:
      'One column carries everything; width is set by the measure of the text, not the viewport.',
    'two-asymmetric':
      'Two columns of deliberately unequal width — the narrow one is a margin that holds content, not whitespace.',
    'two-equal':
      'Two columns of matched width, so neither reads as primary and the eye must choose.',
    three:
      'Three columns, close to newspaper measure, which forces short paragraphs and hard editing.',
    'irregular-twelve':
      'A twelve-unit grid whose spans change per block, so no two rows align the same way.',
    masonry: 'Blocks of differing heights packed by column, leaving a ragged bottom edge.',
  },
  axis: {
    vertical: 'The eye travels top to bottom; structure is built from stacked horizontal bands.',
    horizontal:
      'The eye travels left to right along a dominant band; the page reads as a strip, not a stack.',
    diagonal: 'The primary reading path cuts a corner-to-corner line across the layout.',
    radial: 'Content orbits a single anchor point; position is read as distance from that center.',
  },
  symmetry: {
    symmetric: 'Balanced about the vertical center line; weight matches on both sides.',
    'left-weighted': 'Visual mass gathers left, leaving the right side open.',
    'right-weighted':
      'Visual mass gathers right, so the page resolves against the reading direction.',
    broken:
      'A near-symmetry deliberately violated in one place, and that violation is the focal point.',
    mirrored: 'One arrangement repeated in reflection, so the repeat itself is the structure.',
  },
  hero_zone: {
    'full-bleed':
      'The hero occupies the entire first screen, edge to edge, with nothing beside it.',
    'upper-left':
      'The hero sits in the upper-left quadrant and everything else arranges around it.',
    center: 'The hero is centered in the viewport with clearance on all four sides.',
    'lower-third': 'The upper two-thirds are held nearly empty; the hero lands low.',
    'edge-bound': 'The hero is pinned against one edge and cropped by it.',
    interleaved:
      'There is no single hero block — the hero phrase is broken up and threaded through the content.',
  },
  density: {
    sparse: 'Very few elements, very large intervals; the page is mostly field.',
    measured: 'Even breathing room; nothing crowds, nothing floats.',
    dense: 'Elements packed close, small gutters, information-forward.',
    crowded: 'Deliberate over-packing to the edge of legibility, treated as texture.',
  },
  rhythm: {
    even: 'One repeating interval throughout; the spacing itself is invisible.',
    accelerating: 'Intervals shrink as the page descends, so it reads faster toward the bottom.',
    syncopated: 'Two alternating intervals, off-beat against each other.',
    interrupted: 'A regular interval broken once by a much larger gap that acts as a caesura.',
  },
  shell_posture: {
    standard: 'A conventional top nav and a footer, present and legible as chrome.',
    marginal:
      'Navigation lives in a margin — a vertical rail or a rotated edge strip, not a top bar.',
    none: 'No nav element at all; the page navigates through in-content links only.',
    'folded-into-hero': 'Navigation is set inside the hero composition and reads as part of it.',
    'footer-only': 'Nothing at the top; all navigation is deferred to the foot of the page.',
  },
  field_ratio: {
    'type-dominant': 'Type is the image; color and shape stay subordinate to it.',
    balanced: 'Type and field carry roughly equal visual weight.',
    'field-dominant': 'Large areas of color or shape lead, with type placed into them.',
    drenched: 'Color or texture floods the full surface; type sits on top of it as an overlay.',
  },
  collapse: {
    stack: 'Every zone keeps its 1440 order and stacks full-width, top to bottom, at 360.',
    reorder:
      'A zone moves ahead of where it sat at 1440 so the idea leads at 360; the MOBILE order says which.',
    'hero-only': 'The first fold at 360 is the hero alone; everything else follows below it.',
    'rail-to-band':
      'A rail or sidebar becomes a full-width horizontal band at 360, placed where its content belongs.',
    'split-to-sequence':
      'A split field becomes a sequence of full-width fields at 360, the relationship kept by adjacency: a question above its answer still faces it.',
  },
}

/**
 * One-sentence compositional meaning of an axis value.
 *
 * @param {string} axis
 * @param {string} value
 * @returns {string|null} the description, or null for an unknown axis/value
 */
export function describeAxisValue(axis, value) {
  return AXIS_VALUE_DESCRIPTIONS[axis]?.[value] ?? null
}

/**
 * Validate a composition tuple: every axis present, every value permitted.
 * Deliberately has no name check — accepting a novel composition is the
 * entire point of this module.
 *
 * @param {object} tuple
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidTuple(tuple) {
  const errors = []
  if (!tuple || typeof tuple !== 'object' || Array.isArray(tuple)) {
    return { valid: false, errors: ['composition must be an object of axis → value'] }
  }
  for (const axis of AXIS_NAMES) {
    const value = tuple[axis]
    if (value === undefined || value === null || value === '') {
      errors.push(`missing axis: ${axis}`)
    } else if (!COMPOSITION_AXES[axis].includes(value)) {
      errors.push(
        `invalid ${axis}: "${value}" (expected one of: ${COMPOSITION_AXES[axis].join(', ')})`
      )
    }
  }
  for (const key of Object.keys(tuple)) {
    if (!AXIS_NAMES.includes(key)) errors.push(`unknown axis: ${key}`)
  }
  return { valid: errors.length === 0, errors }
}

/**
 * Render a tuple as the `===COMPOSITION===` block body — the same
 * `key: value` shape the Art Director emits, so what we send and what we
 * parse back are one format.
 *
 * @param {object} tuple
 * @returns {string}
 */
export function formatTuple(tuple) {
  return AXIS_NAMES.map((axis) => `${axis}: ${tuple?.[axis] ?? '?'}`).join('\n')
}
