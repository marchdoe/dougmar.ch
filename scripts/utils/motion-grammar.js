/**
 * The motion grammar: the `===MOTION===` block's vocabulary and validation.
 *
 * Nothing on the shipped site moves (#506). The code carries 120 to 200ms
 * colour hovers and nothing else: no keyframes, no reduced-motion rule, and
 * the critics grade a still taken after `networkidle` plus a flat second, so
 * an entrance would be over before the shutter. The reference sites the owner
 * points at are defined by motion: type settling in, a ground that drifts,
 * sections revealing on scroll. This block declares those three things as
 * enumerated values a critic can read off a frame strip.
 *
 * Modelled on header-grammar.js: enumerated fields, a validator that names
 * every error, and a formatter that round-trips through the parser.
 *
 * @module
 */

import { checkVocabulary } from './vocabulary-check.js'

/**
 * The three fields and their vocabularies.
 *
 * `entrance` is how the hero arrives: `settle` (opacity and an 8px lift),
 * `rise` (opacity and a 24px lift), `wipe` (a clip-path reveal left to
 * right), or `none`. `ground` is whether the field or material moves, slowly.
 * `reveal` is what sections below the fold do.
 *
 * @type {Record<string, string[]>}
 */
export const MOTION_FIELDS = {
  entrance: ['none', 'settle', 'rise', 'wipe'],
  ground: ['static', 'drift'],
  reveal: ['none', 'on-scroll'],
}

/** Field names in canonical order. */
export const MOTION_FIELD_NAMES = Object.keys(MOTION_FIELDS)

/** A page that arrives fully formed and holds still. */
export const STILL_MOTION = { entrance: 'none', ground: 'static', reveal: 'none' }

/**
 * Validate a parsed MOTION block.
 *
 * @param {Record<string, string|null>} decl parseMotionBlock output
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidMotion(decl) {
  if (!decl || typeof decl !== 'object' || Array.isArray(decl)) {
    return { valid: false, errors: ['motion must be an object of field to value'] }
  }
  const errors = checkVocabulary(decl, MOTION_FIELDS)
  return { valid: errors.length === 0, errors }
}

/**
 * Render a motion declaration as the `===MOTION===` block body, the same
 * `key: value` shape the Art Director emits, so what we send downstream and
 * what we parse back are one format.
 *
 * @param {Record<string, string|null>} decl
 * @returns {string}
 */
export function formatMotion(decl) {
  return MOTION_FIELD_NAMES.map((field) => `${field}: ${decl?.[field] ?? '?'}`).join('\n')
}

/**
 * Whether anything moves in the first second after paint: an entrance, or a
 * drifting ground. This is the guard on the frame-strip capture; `reveal` is
 * below the fold and never in the strip. A missing declaration is a still
 * page, so an archive that predates the block captures nothing new.
 *
 * @param {Record<string, string|null>|null|undefined} decl
 * @returns {boolean}
 */
export function hasFirstPaintMotion(decl) {
  if (!decl) return false
  const entrance = decl.entrance ?? 'none'
  const ground = decl.ground ?? 'static'
  return entrance !== 'none' || ground !== 'static'
}

/**
 * Whether the engineer needs the motion-design reference: an entrance or a
 * scroll reveal to time and ease. A drifting ground alone is one declaration
 * the engineer prompt already spells out.
 *
 * @param {Record<string, string|null>|null|undefined} decl
 * @returns {boolean}
 */
export function wantsMotionReference(decl) {
  if (!decl) return false
  return (decl.entrance ?? 'none') !== 'none' || (decl.reveal ?? 'none') !== 'none'
}
