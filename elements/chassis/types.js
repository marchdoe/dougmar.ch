/**
 * Type definitions for the fonts + type-system chassis catalog.
 * JSDoc-only — there is no runtime export. Authoring chassis files
 * `@type {ChassisEntry}` gets autocompletion + type checking in IDEs
 * without forcing the orchestrator (plain Node) to load a TS runtime.
 */

/**
 * @typedef {Object} FontSpec
 * @property {string} family
 *   Google Fonts family name as it appears on fonts.google.com (e.g. 'Playfair Display').
 * @property {string[]} fallbacks
 *   CSS fallback stack appended after the Google Fonts family.
 *   E.g. ['Georgia', 'Times New Roman', 'serif'].
 * @property {number[]} weights
 *   Weights to load from Google Fonts. Must all exist on the family's specimen
 *   page — verify at fonts.google.com/specimen/<family> before adding a chassis.
 * @property {boolean} italics
 *   Whether to also load italic variants of the listed weights.
 */

/**
 * @typedef {Object} TypeStep
 * @property {string} size
 *   Font size as a rem value, or a `clamp()` expression for fluid display
 *   steps (`xl` and up, where the chassis wants them fluid).
 * @property {number} lineHeight
 *   Unitless leading for this step. Tightens as size grows: body ~1.5,
 *   headlines ~1.1, hero 0.9–1.05 depending on the face.
 * @property {string} tracking
 *   Letter-spacing for this step, as an em value or '0'. Opens below `base`,
 *   closes above it — but the amount is a property of the face: condensed
 *   caps want different hero tracking than a didone.
 */

/**
 * @typedef {Object} ChassisType
 * @property {Record<string, TypeStep>} steps
 *   The full ramp, one entry per step in scale.js RAMP_STEPS
 *   (`2xs`..`5xl` plus `hero`). Generate with `scaleSteps(ratio, base,
 *   overrides)` and lay face-specific overrides on top — the stored table is
 *   explicit and reviewable either way.
 * @property {Record<string, number>} weights
 *   The fontWeights token map (light/normal/medium/semibold/bold). Every
 *   value must be a weight some font in this chassis actually loads —
 *   a name mapped to an unloaded weight renders as a faux weight.
 * @property {string} [rhythm]
 *   Optional spacing rhythm as a rem value. Defaults to the base step's
 *   size times its line-height (24px on a 1rem/1.5 chassis). The spacing
 *   scale is emitted as multiples of this — see buildSpacing().
 */

/**
 * @typedef {Object} ChassisEntry
 * @property {string} id
 *   Stable identifier. Lowercase, hyphenated. Used in Director output.
 * @property {'serif'|'grotesque'|'condensed'|'slab'|'mono'|'display'} class
 *   The register the display face belongs to (#502). The chassis mandate
 *   soft-forbids a class after three nights running on it, so three
 *   different condensed pairs no longer count as three different choices.
 * @property {string} name
 *   Human-readable name shown to the Director and in archive metadata.
 * @property {string} description
 *   One-line description of the typographic feel.
 * @property {string[]} moods
 *   Tags the Director matches against the day's brief and chosen archetype.
 * @property {string[]} archetypes
 *   Archetype affinities — chassis IDs the Director should prefer for each archetype.
 * @property {Record<string, FontSpec>} fonts
 *   Font tokens. Key becomes the token name in `theme.tokens.fonts`
 *   (components reference by name: `fontFamily: 'display'`).
 *   Convention: include at least one of `display`/`heading`/`serif` and
 *   one of `body`/`sans`. Optional `mono` for code/tabular. Two keys may
 *   share one family — buildGoogleFontsUrl merges duplicates — which is how
 *   a single-family chassis declares itself.
 * @property {ChassisType} type
 *   The type system: explicit step table, weights map, optional rhythm.
 *   Generates fontSizes, textStyles, lineHeights, letterSpacings,
 *   fontWeights and spacing deterministically.
 */

export {}
