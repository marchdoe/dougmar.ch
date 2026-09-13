/**
 * The type grammar: the `===TYPE_TREATMENT===` block's vocabulary and
 * validation.
 *
 * Eight builds from 2026-09-05 to -12 used eight different chassis and set
 * every one the same way: mixed case, left or centred, one display step plus
 * body. The Art Director chooses a chassis from the catalogue and nothing
 * lets it say how the type is set, so the only typographic variance was which
 * pair loaded (#502). Case, italic lead, weight extreme, alignment and texture
 * are decisions; this block carries them, the mandate tracks them, and both
 * critics check them.
 *
 * Modelled on header-grammar.js: enumerated fields, a validator that names
 * every error, and a formatter that round-trips through the parser.
 *
 * @module
 */

import { CHASSIS_CATALOG } from '../../elements/chassis/index.js'
import { checkVocabulary } from './vocabulary-check.js'

/**
 * The five fields and their vocabularies.
 *
 * `case` is how the hero phrase and the display register are set. `lead:
 * italic` means the hero phrase itself leads in italic, not an accent word.
 * `weight` names the end of the loaded range to reach for. `alignment` is the
 * hero block's alignment at 1440. `texture` is type used as material.
 *
 * @type {Record<string, string[]>}
 */
export const TYPE_FIELDS = {
  case: ['mixed', 'caps', 'lower', 'small-caps'],
  lead: ['roman', 'italic'],
  weight: ['light', 'regular', 'heavy'],
  alignment: ['left', 'centred', 'right', 'justified'],
  texture: ['none', 'type-as-texture', 'vertical', 'outline', 'stacked'],
}

/** Field names in canonical order. */
export const TYPE_FIELD_NAMES = Object.keys(TYPE_FIELDS)

/** The face the hero phrase is set in. */
function displayFont(chassis) {
  return chassis?.fonts?.display ?? null
}

/** Chassis ids whose display face loads italics, for the error message. */
function italicChassisIds() {
  return CHASSIS_CATALOG.filter((c) => displayFont(c)?.italics).map((c) => c.id)
}

/**
 * `lead: italic` needs a display italic to lead in. A chassis that loads none
 * renders a synthesized oblique, which is the faux italic the catalogue was
 * curated to avoid.
 */
function checkItalicLead(decl, chassis) {
  const font = displayFont(chassis)
  if (decl.lead !== 'italic' || !font || font.italics) return []
  return [
    `lead: italic needs a display italic and ${chassis.id} loads none; chassis that load display italics: ${italicChassisIds().join(', ')}`,
  ]
}

/**
 * `weight: light` or `heavy` names an end of a range. A display face that
 * loads one weight has no ends to reach for.
 */
function checkWeightReach(decl, chassis) {
  const font = displayFont(chassis)
  if (!font || font.weights.length > 1) return []
  if (decl.weight !== 'light' && decl.weight !== 'heavy') return []
  return [
    `weight: ${decl.weight} asks for one end of a range and ${chassis.id}'s display face loads a single weight (${font.weights[0]}); declare weight: regular`,
  ]
}

/**
 * Validate a parsed TYPE_TREATMENT block.
 *
 * @param {Record<string, string|null>} decl parseTypeTreatmentBlock output
 * @param {{ chassis?: object|null }} [context] the chosen chassis catalogue entry
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidTypeTreatment(decl, context = {}) {
  if (!decl || typeof decl !== 'object' || Array.isArray(decl)) {
    return { valid: false, errors: ['type treatment must be an object of field → value'] }
  }
  const errors = [
    ...checkVocabulary(decl, TYPE_FIELDS),
    ...checkItalicLead(decl, context.chassis),
    ...checkWeightReach(decl, context.chassis),
  ]
  return { valid: errors.length === 0, errors }
}

/**
 * Render a type treatment as the `===TYPE_TREATMENT===` block body, the same
 * `key: value` shape the Art Director emits, so what we send downstream and
 * what we parse back are one format.
 *
 * @param {Record<string, string|null>} decl
 * @returns {string}
 */
export function formatTypeTreatment(decl) {
  return TYPE_FIELD_NAMES.map((field) => `${field}: ${decl?.[field] ?? '?'}`).join('\n')
}
