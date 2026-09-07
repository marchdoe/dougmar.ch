/**
 * Parsers for the Art Director's MEASURABLES, SHELL, HEADER, COMPOSITION and
 * MOBILE delimiter blocks. All are simple `key: value` lines; `#` starts a
 * comment. Missing/unparseable fields come back null — validation policy
 * lives in the caller (validateArtDirectorResult), not here.
 */

function parseKeyValues(text) {
  const out = {}
  for (const rawLine of String(text || '').split('\n')) {
    // A comment starts at a `#` that begins the line or follows whitespace.
    // Splitting on any `#` truncated every value that contained one — a hex
    // colour, or a role line like "Designer #1" (#221).
    const line = rawLine.replace(/(^|\s)#.*$/, '')
    // Keys may carry digits: the MOBILE block's `hero_step_360` and
    // `nav_360` (#452) were the first to.
    const m = /^\s*([a-z][a-z0-9_]*)\s*:\s*(.+?)\s*$/.exec(line)
    if (m) out[m[1]] = m[2]
  }
  return out
}

function toInt(v) {
  const m = /\d+/.exec(String(v ?? ''))
  return m ? parseInt(m[0], 10) : null
}

/**
 * @returns {{ canvas_utilization_min: number|null, hero_scale: string|null, color_coverage_min: number|null }}
 */
export function parseMeasurablesBlock(text) {
  const kv = parseKeyValues(text)
  return {
    canvas_utilization_min: toInt(kv.canvas_utilization_min),
    hero_scale: kv.hero_scale ?? null,
    color_coverage_min: toInt(kv.color_coverage_min),
  }
}

/**
 * `nav` moved to the HEADER block on 2026-08-30 (#254) — the header stopped
 * being one line of prose inside SHELL and became its own measurable
 * declaration. It is still read here so archived shell.json files written
 * before that date, and the shell mandate's history window, keep parsing.
 * New responses put it in HEADER; parseHeaderBlock is what reads it.
 *
 * @returns {{ nav: string|null, footer: string|null, brand_lockup: string|null, brand_color_mode: string|null, ground_strategy: string|null }}
 */
export function parseShellBlock(text) {
  const kv = parseKeyValues(text)
  return {
    nav: kv.nav ?? null,
    footer: kv.footer ?? null,
    brand_lockup: kv.brand_lockup ?? null,
    brand_color_mode: kv.brand_color_mode ? kv.brand_color_mode.toLowerCase().trim() : null,
    // Palette-formula mandate (2026-08-23): the "ground" a palette commits
    // to — added as a SHELL field rather than a new block since it's a
    // structural declaration like nav/footer, not a poetic color spec.
    // Optional: old archives and pre-mandate responses won't have it.
    ground_strategy: kv.ground_strategy ? kv.ground_strategy.toLowerCase().trim() : null,
  }
}

/**
 * The Art Director's `===HEADER===` block — the header as a set of numbers a
 * critic can measure off a crop, rather than the single line of prose it used
 * to be inside SHELL (#254). Vocabulary and validation live in
 * utils/header-grammar.js; this only reads.
 *
 * `nav` stays prose because the character of a nav is not a number. Everything
 * beside it is: height, mark size, the ramp steps the wordmark and the links
 * are set at, whether the role line is on.
 *
 * All fields optional here — missing/unparseable fields come back null so
 * validation policy stays entirely in the caller.
 *
 * @returns {{ placement: string|null, height_px: number|null, mark_px: number|null, wordmark_step: string|null, wordmark_weight: number|null, role_line: string|null, nav_step: string|null, nav_case: string|null, nav: string|null }}
 */
export function parseHeaderBlock(text) {
  const kv = parseKeyValues(text)
  const norm = (v) => (v ? v.toLowerCase().trim() : null)
  return {
    placement: norm(kv.placement),
    height_px: toInt(kv.height_px),
    mark_px: toInt(kv.mark_px),
    wordmark_step: norm(kv.wordmark_step),
    wordmark_weight: toInt(kv.wordmark_weight),
    role_line: norm(kv.role_line),
    nav_step: norm(kv.nav_step),
    nav_case: norm(kv.nav_case),
    // Prose, so it keeps its capitalization.
    nav: kv.nav ?? null,
  }
}

/**
 * The Art Director's `===COMPOSITION===` block — the nine composition-axis
 * key: value declarations (see utils/composition-grammar.js for the
 * vocabulary). Successor to the four-key `===LAYOUT_SIGNATURE===` block this
 * function used to parse (renamed 2026-08-23, Task 4 of the
 * composition-grammar arc — the fixed archetype list it validated against
 * is gone; composition is now the sole structural declaration). All fields
 * optional here — missing/unparseable fields come back null so validation
 * policy stays entirely in the caller, and any legacy `layout-signature.json`
 * written under the original four-key shape still parses: the newer keys
 * simply come back null, which the per-axis mandate treats as "no history
 * for this axis" rather than an error. `collapse` (#452) is the ninth key and
 * every composition.json written before it is in the same position.
 *
 * @returns {Record<'columns'|'axis'|'symmetry'|'hero_zone'|'density'|'rhythm'|'shell_posture'|'field_ratio'|'collapse', string|null>}
 */
export function parseCompositionBlock(text) {
  const kv = parseKeyValues(text)
  const norm = (v) => (v ? v.toLowerCase().trim() : null)
  return {
    columns: norm(kv.columns),
    axis: norm(kv.axis),
    symmetry: norm(kv.symmetry),
    hero_zone: norm(kv.hero_zone),
    density: norm(kv.density),
    rhythm: norm(kv.rhythm),
    shell_posture: norm(kv.shell_posture),
    field_ratio: norm(kv.field_ratio),
    collapse: norm(kv.collapse),
  }
}

/**
 * The Art Director's `===MOBILE===` block: what the composition becomes at
 * 360 (#452). Vocabulary and validation live in utils/mobile-grammar.js; this
 * only reads. `hero_step_360` is the enumerated field and is normalized; the
 * other four are prose and keep their capitalization.
 *
 * All fields optional here — missing/unparseable fields come back null so
 * validation policy stays entirely in the caller.
 *
 * @returns {{ carrier: string|null, first_fold: string|null, order: string|null, hero_step_360: string|null, nav_360: string|null }}
 */
export function parseMobileBlock(text) {
  const kv = parseKeyValues(text)
  return {
    carrier: kv.carrier ?? null,
    first_fold: kv.first_fold ?? null,
    order: kv.order ?? null,
    hero_step_360: kv.hero_step_360 ? kv.hero_step_360.toLowerCase().trim() : null,
    nav_360: kv.nav_360 ?? null,
  }
}
