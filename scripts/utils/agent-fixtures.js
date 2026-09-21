/**
 * Recorded agent responses, so the pipeline can be run without spending.
 *
 * `MOCK_MODE=true` used to throw: the flag was honoured nowhere, `pnpm
 * pipeline` set it, and anyone who believed they were running a mock was
 * making billed calls (#220). Refusing to run was the right first fix and
 * the wrong resting place — it left `runAgentSwarm`, 1,736 lines with no
 * tests, executable only by paying for it, which is why nobody has ever
 * refactored it (#221).
 *
 * A fixture is the raw text a `claude` CLI call returned. Every agent goes
 * through callClaudeCLI, and every response is parsed by
 * parseDelimiterResponse, so replaying text at that seam exercises the whole
 * swarm — the parsers, the validators, the gates, the retry branches, the
 * archive writes — with only the model call replaced.
 *
 * Fixtures are indexed per agent per process, so a run that calls the React
 * Engineer three times (stall retry, required-files retry, posture retry)
 * replays three different responses in order rather than the same one thrice.
 */
import { existsSync, readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { ROOT } from './file-manager.js'

/**
 * Where the fixtures live. `fixtures/agents/` is the night the swarm tests are
 * written against: they assert on its hero line, its file list and its one
 * invented component, so it is frozen. `FIXTURE_DIR` points a run at another
 * corpus; `pipeline:canary --mock` uses `fixtures/canary/`, a night recorded
 * against the current prompts and gates, and re-records there. The two moved
 * apart on 2026-09-21, when the test night failed the spacing and white-paper
 * gates that had been added since it was recorded (#625).
 */
export const FIXTURE_DIR = process.env.FIXTURE_DIR
  ? path.resolve(ROOT, process.env.FIXTURE_DIR)
  : path.join(ROOT, 'fixtures', 'agents')

/** Calls made per agent in this process, so replay follows call order. */
const callCounts = new Map()

/** Test seam: forget which fixtures this process has already served. */
export function resetFixtureCounts() {
  callCounts.clear()
}

/** @returns {boolean} whether calls should be replayed rather than made */
export function isMockMode() {
  return process.env.MOCK_MODE === 'true'
}

/** @returns {boolean} whether real responses should be written to disk */
export function isRecording() {
  return process.env.RECORD_FIXTURES === 'true'
}

/**
 * Where the Nth call to an agent is stored.
 *
 * @param {string} agentName
 * @param {number} index zero-based call number within the run
 * @returns {string}
 */
export function fixturePath(agentName, index) {
  return path.join(FIXTURE_DIR, agentName, `${String(index).padStart(2, '0')}.txt`)
}

/** @returns {number[]} call indexes on disk for an agent, ascending */
function availableIndexes(agentName) {
  const dir = path.join(FIXTURE_DIR, agentName)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => /^\d+\.txt$/.test(f))
    .map((f) => parseInt(f, 10))
    .sort((a, b) => a - b)
}

/**
 * Take the next recorded response for an agent.
 *
 * A run that makes more calls than were recorded replays the last one and
 * says so, rather than crashing: an extra retry is exactly the kind of thing
 * a refactor changes, and a harness that dies on it is a harness people stop
 * using. The reuse is logged so it can never be mistaken for a faithful
 * replay.
 *
 * @param {string} agentName
 * @returns {string} the recorded response text
 * @throws when the agent has no fixtures at all
 */
export function nextFixture(agentName) {
  const index = callCounts.get(agentName) ?? 0
  callCounts.set(agentName, index + 1)

  const indexes = availableIndexes(agentName)
  if (indexes.length === 0) {
    throw new Error(
      `MOCK_MODE=true but no fixtures for "${agentName}". Expected ${fixturePath(agentName, 0)}. ` +
        `Record a real run with RECORD_FIXTURES=true (FIXTURE_DIR picks the corpus), or rebuild ` +
        `from an archived build: node scripts/build-fixtures-from-archive.js <date>`
    )
  }

  if (indexes.includes(index)) return readFileSync(fixturePath(agentName, index), 'utf8')

  const fallback = indexes[indexes.length - 1]
  console.log(
    `  [${agentName}] fixture ${index} not recorded; replaying ${fallback} again ` +
      `(this run calls ${agentName} more times than the recording did)`
  )
  return readFileSync(fixturePath(agentName, fallback), 'utf8')
}

/**
 * Write a real response out as the next fixture for an agent.
 *
 * @param {string} agentName
 * @param {string} response
 * @returns {string} the path written
 */
export function recordFixture(agentName, response) {
  const index = callCounts.get(agentName) ?? 0
  callCounts.set(agentName, index + 1)
  const file = fixturePath(agentName, index)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, response, 'utf8')
  console.log(`  [${agentName}] recorded fixture → ${path.relative(ROOT, file)}`)
  return file
}

/**
 * Refuse to replay in CI.
 *
 * A mocked nightly would commit and publish a design nobody generated, and
 * would do it silently — every gate downstream would pass, because the
 * fixtures were recorded from a run that passed. Cheaper to make this
 * impossible than to detect it afterwards.
 *
 * @throws when mock or record mode is set inside GitHub Actions
 */
export function assertNotAutomated() {
  if (!process.env.GITHUB_ACTIONS) return
  if (isMockMode()) {
    throw new Error(
      'MOCK_MODE=true inside GitHub Actions. A mocked run would publish a design no agent produced.'
    )
  }
  if (isRecording()) {
    throw new Error('RECORD_FIXTURES=true inside GitHub Actions. Record fixtures locally.')
  }
}
