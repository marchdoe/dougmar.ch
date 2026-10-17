import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import * as yaml from 'js-yaml'

/**
 * @typedef {object} GoldStandard
 * @property {string} file basename inside references/
 * @property {string} path absolute path to the image
 * @property {string | null} date YYYY-MM-DD taken from the file name, if present
 * @property {string} description the taste note from index.yml
 */

/**
 * Load the `gold: true` entries of references/index.yml whose image exists.
 * Shared by every stage that sends gold standards to a model, so they all see
 * the same set in the same (index) order. Entries with no image on disk are
 * returned in `missing` so callers can log them.
 *
 * @param {{ root: string }} opts repo root
 * @returns {Promise<{ standards: GoldStandard[], missing: string[] }>}
 */
export async function loadGoldStandards({ root }) {
  const indexPath = path.join(root, 'references/index.yml')
  if (!existsSync(indexPath)) return { standards: [], missing: [] }
  const doc = yaml.load(await readFile(indexPath, 'utf8'))
  const refs = Array.isArray(doc?.references) ? doc.references : []
  const standards = []
  const missing = []
  for (const ref of refs) {
    if (ref?.gold !== true || typeof ref.file !== 'string') continue
    const abs = path.join(root, 'references', ref.file)
    if (!existsSync(abs)) {
      missing.push(ref.file)
      continue
    }
    standards.push({
      file: ref.file,
      path: abs,
      date: ref.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null,
      description: ref.description ?? ref.file,
    })
  }
  return { standards, missing }
}
