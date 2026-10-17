import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import * as yaml from 'js-yaml'

/**
 * Reference tiers in references/index.yml.
 *  - floor: the owner's minimum bar; every night must be at least this good.
 *  - gold: aspirational; empty until the owner names one.
 */
export const TIERS = ['floor', 'gold']

/**
 * @typedef {object} TierEntry
 * @property {string} file basename inside references/
 * @property {string} path absolute path to the image
 * @property {string | null} date YYYY-MM-DD taken from the file name, if present
 * @property {string} description the taste note from index.yml
 */

/**
 * Load the entries of one tier whose image exists. Shared by every stage that
 * sends tiered references to a model, so they all see the same set in the same
 * (index) order. Entries with no image on disk are returned in `missing` so
 * callers can log them.
 *
 * @param {{ root: string, tier: 'floor' | 'gold' }} opts repo root and tier
 * @returns {Promise<{ entries: TierEntry[], missing: string[] }>}
 */
export async function loadTier({ root, tier }) {
  if (!TIERS.includes(tier)) throw new Error(`unknown reference tier "${tier}"`)
  const indexPath = path.join(root, 'references/index.yml')
  if (!existsSync(indexPath)) return { entries: [], missing: [] }
  const doc = yaml.load(await readFile(indexPath, 'utf8'))
  const refs = Array.isArray(doc?.references) ? doc.references : []
  const entries = []
  const missing = []
  for (const ref of refs) {
    if (ref?.tier !== tier || typeof ref.file !== 'string') continue
    const abs = path.join(root, 'references', ref.file)
    if (!existsSync(abs)) {
      missing.push(ref.file)
      continue
    }
    entries.push({
      file: ref.file,
      path: abs,
      date: ref.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null,
      description: ref.description ?? ref.file,
    })
  }
  return { entries, missing }
}
