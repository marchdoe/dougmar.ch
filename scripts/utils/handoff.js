/**
 * The file a failed run leaves so a re-run does not pay for its first stages
 * again (#578), and the read that takes it back.
 *
 * `handoff.json` sits in the run's `build-failed-*` directory, which the
 * workflow uploads as the failure artifact. It holds the run's date, the
 * inputs its design was made from (the signals and the references file), and
 * the tape of paid responses (`call-tape.js`). A manual dispatch that names the
 * failed run downloads the artifact, and the pipeline reads the file here,
 * puts the inputs back and starts its swarm with the tape.
 *
 * The inputs go back because the design answers to them. The quote signal is a
 * random draw (zenquotes.io/api/random), so a re-collected `today.yml` holds a
 * different quote from the one the Art Director's hero line may quote, and the
 * copy gate reads that quote from disk to let its em dash through.
 *
 * The file is model output, written by a run that read public feeds, and it is
 * treated that way. Nothing in it is executed. The tape's texts go back through
 * the same parsers and validators a fresh reply meets, and this module checks
 * the envelope. The two inputs are written as data: the signals through
 * `yaml.dump`, the references as the text they are. A scheduled run never reads
 * one: the workflow sets `RESUME_HANDOFF` from a dispatch input only, and the
 * check below refuses it on the `schedule` event as well.
 *
 * @module
 */

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import * as yaml from 'js-yaml'
import { TAPED_AGENTS, recordedCalls } from './call-tape.js'
import { runDate } from './run-date.js'

export const HANDOFF_FILE = 'handoff.json'
export const HANDOFF_VERSION = 1

/** Where the run's inputs live, relative to the checkout. */
const SIGNALS_FILE = path.join('signals', 'today.yml')
const REFERENCES_FILE = path.join('signals', 'today.references.md')

/** A reply is tens of KB; a megabyte of one is not a reply. */
const MAX_ENTRY_CHARS = 1_000_000
/** Two designer rounds of retries around a first pass is a dozen calls; this is generous. */
const MAX_ENTRIES = 40

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

function refuse(reason) {
  throw new Error(`handoff refused: ${reason}`)
}

/** @param {unknown} entry @param {number} i */
function checkEntry(entry, i) {
  if (!isObject(entry)) refuse(`tape entry ${i} is not an object`)
  if (!TAPED_AGENTS.includes(entry.agent)) refuse(`tape entry ${i} names agent "${entry.agent}"`)
  if (typeof entry.text !== 'string' || entry.text === '') refuse(`tape entry ${i} has no text`)
  if (entry.text.length > MAX_ENTRY_CHARS)
    refuse(`tape entry ${i} is over ${MAX_ENTRY_CHARS} characters`)
  if (typeof entry.channel !== 'string' || entry.channel.length > 40) {
    refuse(`tape entry ${i} has no usable channel`)
  }
}

/**
 * @typedef {object} Resume
 * @property {object} signals the signals the failed run's design was made from
 * @property {string|null} references its `signals/today.references.md`, if it had one
 * @property {Array<{ agent: string, text: string, channel: string }>} tape
 */

/**
 * Read a handoff's text into what the pipeline needs, or throw.
 *
 * @param {string} text the file's contents
 * @param {{ date: string }} expected the day this run is for
 * @returns {Resume}
 */
export function parseHandoff(text, { date }) {
  let data
  try {
    data = JSON.parse(text)
  } catch (err) {
    refuse(`not JSON (${err.message})`)
  }
  if (!isObject(data) || data.version !== HANDOFF_VERSION) {
    refuse(`version is not ${HANDOFF_VERSION}`)
  }
  // A design made for one day is not shipped as another's. The tape's stages
  // are keyed on the date (the archive, the lane history, the mandates).
  if (data.date !== date) {
    refuse(`it was written for ${data.date} and this run is for ${date}; start a normal run`)
  }
  if (!isObject(data.signals) || runDate(data.signals) !== date) {
    refuse('its signals are missing or are for another day')
  }
  const references = data.references ?? null
  if (
    references !== null &&
    (typeof references !== 'string' || references.length > MAX_ENTRY_CHARS)
  ) {
    refuse('its references are not text, or are too long')
  }
  if (!Array.isArray(data.tape) || data.tape.length === 0 || data.tape.length > MAX_ENTRIES) {
    refuse(`its tape is empty or over ${MAX_ENTRIES} entries`)
  }
  data.tape.forEach(checkEntry)
  return {
    signals: data.signals,
    references,
    tape: data.tape.map(({ agent, text, channel }) => ({ agent, text, channel })),
  }
}

/**
 * The resume a run was asked for, or null for a normal run.
 *
 * `RESUME_HANDOFF` is the path to a downloaded `handoff.json`. The workflow
 * sets it only on a manual dispatch that named a failed run; naming the
 * schedule event here too means a stray variable cannot make the unattended
 * run replay old responses.
 *
 * @param {NodeJS.ProcessEnv} env
 * @param {{ date?: string }|null|undefined} signals the signals collected for this run
 * @returns {Promise<Resume|null>}
 */
export async function loadResume(env, signals) {
  const file = env.RESUME_HANDOFF
  if (!file) return null
  if (env.GITHUB_EVENT_NAME === 'schedule') refuse('a scheduled run never resumes')
  return parseHandoff(await readFile(file, 'utf8'), { date: runDate(signals) })
}

/**
 * Put the failed run's inputs where the swarm and its gates read them: the
 * signals over the ones this run just collected, and the references file when
 * the failed run had one.
 *
 * @param {Resume} resume
 * @param {string} root the checkout
 */
export async function restoreInputs(resume, root) {
  await mkdir(path.join(root, 'signals'), { recursive: true })
  await writeFile(
    path.join(root, SIGNALS_FILE),
    yaml.dump(resume.signals, { lineWidth: -1 }),
    'utf8'
  )
  if (resume.references !== null) {
    await writeFile(path.join(root, REFERENCES_FILE), resume.references, 'utf8')
  }
}

/** The references file as the swarm read it, or null when the run had none. */
async function readReferences(root) {
  const file = path.join(root, REFERENCES_FILE)
  return existsSync(file) ? await readFile(file, 'utf8') : null
}

/**
 * Write this run's tape and inputs beside its trace. Nothing to hand over (the
 * run failed before its first paid stage answered) writes nothing.
 *
 * @param {string} dir the run's `build-failed-*` directory
 * @param {{ root: string, date: string, signals: object }} run
 * @returns {Promise<string|null>} the file written
 */
export async function writeHandoff(dir, { root, date, signals }) {
  const tape = recordedCalls()
  if (tape.length === 0) return null
  const file = path.join(dir, HANDOFF_FILE)
  const handoff = {
    version: HANDOFF_VERSION,
    date,
    createdAt: new Date().toISOString(),
    signals,
    references: await readReferences(root),
    tape,
  }
  await writeFile(file, JSON.stringify(handoff), 'utf8')
  return file
}
