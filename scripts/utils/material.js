/**
 * The deterministic material library, as code (#505).
 *
 * Every nightly build was a flat field, type and a hairline, because the
 * pipeline had no image material: external images are banned, nothing
 * generates a picture, and the nine client marks in `public/clients/` were
 * referenced by the content and rendered by nothing. This module is the half
 * of the material lane that lives outside React:
 *
 *   MATERIAL_NAMES        the six `ground_material` values the Art Director
 *                         may declare in ===SHELL===, `none` included
 *   MATERIAL_OWNER        app/components/Material.tsx, the one file allowed
 *                         to synthesize a material (the validator fails an
 *                         `feTurbulence` anywhere else)
 *   renderMaterialFile    the component source, written by the orchestrator
 *                         every run the way BrandLockup.tsx is
 *   materialSeed          the day's seed, so a re-run of the same date draws
 *                         the same grain
 *   formatMaterialContractBlock
 *                         the exact JSX line the engineer places
 *
 * Kept beside brand-lockup.js rather than inside it: that module is the
 * mark's, and the only thing the two share is the ownership rule.
 *
 * @module
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashToRange } from './deterministic-hash.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATE_PATH = resolve(__dirname, '../templates/Material.tsx.template')

/**
 * The six declarable materials, in prompt order. `none` is a real value and
 * the honest one on a type-only day; the others are textures the component
 * draws from the semantic tokens and the day's seed.
 * @type {ReadonlyArray<string>}
 */
export const MATERIAL_NAMES = Object.freeze(['none', 'grain', 'mesh', 'halftone', 'rule', 'dots'])

/** The one file that may synthesize a material. */
export const MATERIAL_OWNER = 'app/components/Material.tsx'

/** Largest 32-bit signed integer: the top of the seed range. */
const SEED_MAX = 2 ** 31 - 1

/**
 * Is this a declarable material?
 * @param {unknown} value
 * @returns {boolean}
 */
export function isMaterialName(value) {
  return typeof value === 'string' && MATERIAL_NAMES.includes(value)
}

/**
 * The day's material seed: a namespaced FNV-1a hash of the date, the same
 * idiom `risk:<date>` uses, so the seed varies across days and repeats for a
 * re-run of the same day.
 *
 * @param {string} date YYYY-MM-DD
 * @returns {number} an integer in [1, 2^31 - 1]
 */
export function materialSeed(date) {
  return hashToRange(`material:${date}`, 1, SEED_MAX)
}

/**
 * The JSX the engineer places, verbatim.
 * @param {string} material one of MATERIAL_NAMES other than `none`
 * @param {number} seed from materialSeed
 * @returns {string}
 */
export function groundJsx(material, seed) {
  return `<Ground material="${material}" seed={${seed}} />`
}

/**
 * The Ground Material block for the React Engineer's user prompt: the exact
 * line to place when a material is declared, and an explicit nothing when
 * the declaration is `none`.
 *
 * @param {string|null|undefined} material the parsed `ground_material`
 * @param {number} seed from materialSeed
 * @returns {string}
 */
export function formatMaterialContractBlock(material, seed) {
  const declared = isMaterialName(material) ? material : 'none'
  if (declared === 'none') {
    return [
      '## Ground Material',
      '',
      'ground_material: none. Render no <Ground /> and do not import app/components/Material.tsx; the hero field is a flat token colour today.',
    ].join('\n')
  }
  return [
    '## Ground Material',
    '',
    `ground_material: ${declared}. Place this line, copied exactly, as the first child of the relatively positioned hero, with the hero's content in a sibling set position: relative and z-index: 1:`,
    '',
    groundJsx(declared, seed),
    '',
    "Import it with `import { Ground } from '../components/Material'` from a route or `'../Material'` from app/components/generated/. The seed is the day's and the material is the declared one; change neither, and never redraw the material by hand.",
  ].join('\n')
}

/**
 * Render `app/components/Material.tsx`.
 *
 * Same pattern as `renderBrandLockupFile` in brand-lockup.js: the
 * orchestrator writes this file every run, no agent ever authors it, and the
 * template is read fresh on each call so a dev loop sees edits without a node
 * restart. The template takes no inputs; the seed arrives as a prop at render
 * time so one file serves every day.
 *
 * @returns {string} TSX source
 */
export function renderMaterialFile() {
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  for (const name of MATERIAL_NAMES) {
    if (!template.includes(`'${name}'`)) {
      throw new Error(`Material.tsx.template does not handle material '${name}'`)
    }
  }
  return template
}
