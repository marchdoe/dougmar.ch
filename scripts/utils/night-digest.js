/**
 * The Art Director's memory of recent nights: one line per archived night
 * (spec 11, 1b).
 *
 * It used to read the last five `archive/<date>/brief.md` files in full, about
 * 16KB of prose. On 2026-09-28 it rebuilt 2026-09-18's page (violet split
 * field, ruled lines, nav card top left, work list right) and reused the hero
 * line 2026-09-22 and 2026-09-14 had both shipped. Neither night was in its
 * five. A line per night covers fourteen in less room, and names the fields a
 * repeat is made of: the composition tuple, the primary hue, the ground, the
 * type register and the hero phrase.
 *
 * Every field comes from `record.json`, the per-night summary the pipeline
 * writes at archive time (#153), except the type treatment, which the record
 * does not carry and which is read from the shipped build's
 * `type-treatment.json`. A date with no record is rebuilt from its build's
 * artifacts by `buildRecord`, the function the backfill uses. A field an older
 * night never recorded prints as `?`: the composition tuple starts on
 * 2026-08-23 and the type treatment on 2026-09-14 (#502).
 *
 * @module
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { buildRecord, pickBuild } from './archive-record.js'
import { readJsonSafe } from './archive-fs.js'
import { readRecentDates } from './recent-builds.js'
import { AXIS_NAMES } from './composition-grammar.js'
import { TYPE_FIELD_NAMES } from './type-grammar.js'

/** Nights the digest lists. */
export const DIGEST_NIGHTS = 14

/** The longest archetype label kept; a few nights wrote a sentence there. */
const ARCHETYPE_MAX = 60

/**
 * @typedef {object} Night
 * @property {string} date
 * @property {Record<string, string>|null} composition
 * @property {string|null} archetype
 * @property {{ h: number, name?: string }|null} hue
 * @property {{ strategy: string|null, material: string|null }|null} ground
 * @property {string|null} chassis
 * @property {Record<string, string>|null} typeTreatment
 * @property {string|null} hero
 */

/**
 * @param {unknown} value
 * @returns {string|null} the trimmed string, or null when blank or not a string
 */
function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/**
 * The night's record: `record.json`, or rebuilt from the build when missing.
 * @param {string} archiveDir
 * @param {string} date
 * @returns {object}
 */
function readRecord(archiveDir, date) {
  const cached = readJsonSafe(path.join(archiveDir, date, 'record.json'))
  if (cached) return cached
  try {
    return buildRecord(date, { archiveDir, signals: {} }) ?? {}
  } catch {
    return {}
  }
}

/**
 * The archetype label from `archetype.txt`, or the record's legacy name.
 * @param {string} dateDir
 * @param {object} record
 * @returns {string|null}
 */
function readArchetype(dateDir, record) {
  const file = path.join(dateDir, 'archetype.txt')
  const raw = existsSync(file) ? text(readFileSync(file, 'utf8')) : null
  return raw ?? text(record.legacyArchetype)
}

/**
 * One archived night's digest fields.
 * @param {string} archiveDir path to `archive/`
 * @param {string} date
 * @returns {Night}
 */
export function readNight(archiveDir, date) {
  const dateDir = path.join(archiveDir, date)
  const record = readRecord(archiveDir, date)
  const { buildDir } = pickBuild(dateDir)
  const hue = record.colorScheme?.primary_hue
  const shell = record.shell
  return {
    date,
    composition: record.composition ?? null,
    archetype: readArchetype(dateDir, record),
    hue: typeof hue?.h === 'number' ? hue : null,
    ground: shell
      ? { strategy: text(shell.ground_strategy), material: text(shell.ground_material) }
      : null,
    chassis: text(record.chassis),
    typeTreatment: buildDir ? readJsonSafe(path.join(buildDir, 'type-treatment.json')) : null,
    hero: text(record.hero?.copy),
  }
}

/**
 * Values in a fixed field order joined with `/`, `?` for a missing field.
 * @param {Record<string, unknown>|null} decl
 * @param {string[]} names
 * @returns {string} '?' when the whole declaration is missing
 */
function slashed(decl, names) {
  if (!decl) return '?'
  return names.map((n) => text(decl[n]) ?? '?').join('/')
}

/**
 * @param {Night} night
 * @returns {string}
 */
function formatLayout(night) {
  const tuple = slashed(night.composition, AXIS_NAMES)
  if (!night.archetype) return tuple
  const label =
    night.archetype.length > ARCHETYPE_MAX
      ? `${night.archetype.slice(0, ARCHETYPE_MAX - 1).trimEnd()}…`
      : night.archetype
  return `${tuple} "${label.replace(/\s+/g, ' ')}"`
}

/** @param {Night} night */
function formatHue(night) {
  if (!night.hue) return '?'
  return night.hue.name ? `${night.hue.h} ${night.hue.name}` : String(night.hue.h)
}

/** @param {Night} night */
function formatGround(night) {
  if (!night.ground) return '?'
  return `${night.ground.strategy ?? '?'}/${night.ground.material ?? '?'}`
}

/** @param {Night} night */
function formatType(night) {
  return `${night.chassis ?? '?'} ${slashed(night.typeTreatment, TYPE_FIELD_NAMES)}`
}

/**
 * One night on one line. The hero phrase keeps its own line breaks out.
 * @param {Night} night
 * @returns {string}
 */
export function formatNightLine(night) {
  const hero = night.hero ? `"${night.hero.replace(/\s+/g, ' ')}"` : '?'
  return [
    night.date,
    `layout ${formatLayout(night)}`,
    `hue ${formatHue(night)}`,
    `ground ${formatGround(night)}`,
    `type ${formatType(night)}`,
    `hero ${hero}`,
  ].join(' | ')
}

/**
 * The key line above the digest, so the slashed values can be read.
 * @returns {string}
 */
export function digestKey() {
  return [
    'date',
    `layout ${AXIS_NAMES.join('/')} "archetype"`,
    'hue <degrees> <name>',
    'ground <ground_strategy>/<ground_material>',
    `type <chassis> ${TYPE_FIELD_NAMES.join('/')}`,
    'hero "<hero phrase>"',
  ].join(' | ')
}

/**
 * The last `nights` archived nights before `before`, newest first, one line
 * each under a key line. Empty when the archive holds none.
 * @param {string} archiveDir path to `archive/`
 * @param {{ before?: string|null, nights?: number }} [options] `before` is
 *   tonight's date, which is never in its own digest
 * @returns {string}
 */
export function buildNightDigest(archiveDir, { before = null, nights = DIGEST_NIGHTS } = {}) {
  const dates = readRecentDates(archiveDir, { lookbackDays: nights, before })
  if (dates.length === 0) return ''
  const lines = dates.map((date) => formatNightLine(readNight(archiveDir, date)))
  return [digestKey(), ...lines].join('\n')
}
