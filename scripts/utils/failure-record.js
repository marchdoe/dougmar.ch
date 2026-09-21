/**
 * What a failed run leaves beside its trace: its spend and its handoff.
 *
 * Both are telemetry for a night that already lost, so neither may throw out
 * of the swarm's `finally`: each is attempted on its own and a failure is
 * logged.
 *
 * @module
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { writeHandoff } from './handoff.js'
import { currentCost } from './prior-attempts.js'

/**
 * @param {string} dir the run's `build-failed-*` directory
 * @param {{ root: string, date: string, signals: object }} run
 */
export async function writeFailureRecords(dir, { root, date, signals }) {
  try {
    // Same object and shape the archiver writes on success (#432), so the
    // failure issue and the archive read one format.
    await writeFile(
      path.join(dir, 'cost.json'),
      JSON.stringify(await currentCost(root), null, 2),
      'utf8'
    )
  } catch (err) {
    console.warn(`  could not write cost.json: ${err.message}`)
  }
  try {
    const file = await writeHandoff(dir, { root, date, signals })
    if (file) console.log(`  handoff saved to ${path.basename(dir)}/${path.basename(file)}`)
  } catch (err) {
    console.warn(`  could not write handoff.json: ${err.message}`)
  }
}
