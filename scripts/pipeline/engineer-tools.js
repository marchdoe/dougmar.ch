/**
 * How the React Engineer's files reach disk, shared by the engineer phase,
 * the build repair and the gate's revisions (#221). A repair is a patch
 * (#432, docs/adr/0001-repair-as-a-patch.md): the repair and the post-critic
 * revision both go through `buildRepairBrief` and `applyEngineerPatch`.
 */
import { MUTABLE_FILES, ORCHESTRATOR_FILES, ENGINEER_FILES } from '../utils/site-context.js'
import { backup, writeFiles, isWritablePath } from '../utils/file-manager.js'
import { findEngineerOutputProblem } from '../utils/engineer-output-check.js'
import {
  readOwnedFiles,
  loadRepairBriefTemplate,
  renderRepairBrief,
  mergeEngineerPatch,
  deleteFiles,
} from '../utils/engineer-patch.js'
import { sweepGenerated } from '../utils/generated-sweep.js'

/** Maps every mutable file owned by an LLM agent to that agent name.
 *  Token-designer ownership was removed in the Art Director pipeline —
 *  preset.ts is now written by the Art Director. The Art Director's
 *  files are not retried via this map; retries go through the
 *  React Engineer, so a build error that names only the Art Director's
 *  files ends the run without one (`planRepairs`). The Mockup Designer's
 *  HTML never enters the build.
 */
export const FILE_OWNERSHIP = Object.fromEntries([
  ['elements/preset.ts', 'art-director'],
  ...ENGINEER_FILES.map((f) => [f, 'react-engineer']),
])

/**
 * Drop any orchestrator-owned file from an agent's output.
 *
 * react-engineer.md has told the engineer not to emit `__root.tsx`,
 * `preset.ts` or `chassis-preset.ts` for months, and nothing enforced it —
 * a stray block would simply overwrite the generated file after the
 * orchestrator wrote it. `app/components/BrandLockup.tsx` joined that list
 * with #254, and it is the one that matters most: the whole point of the
 * component is that no model authors the mark.
 *
 * @param {Array<{path: string, content: string}>} files
 * @param {string} agentName for the log line
 * @returns {Array<{path: string, content: string}>}
 */
export function dropOrchestratorFiles(files, agentName = 'agent') {
  const kept = []
  for (const file of files ?? []) {
    if (ORCHESTRATOR_FILES.includes(file.path)) {
      console.warn(
        `  ⚠ ${agentName} emitted ${file.path}, which the orchestrator owns — discarding that block`
      )
      continue
    }
    kept.push(file)
  }
  return kept
}

/**
 * Discard files the write allowlist would refuse.
 *
 * `findEngineerOutputProblem` asks the engineer to move these itself, which is
 * the outcome worth having because it fixes the imports too. This is the floor
 * under that: the retry is allowed to fail, and on 2026-09-20 the alternative
 * to a floor was `validateWritePath` throwing out of `applyEngineerPatch`,
 * past `runAgentSwarm`, and ending a run 31 minutes in over one misplaced
 * component. A dropped file whose import survives fails the build gate, which
 * is a repair round. A throw is the whole night.
 *
 * @param {Array<{path: string, content: string}>} files
 * @param {string} agentName for the log line
 * @returns {Array<{path: string, content: string}>}
 */
export function dropUnwritableFiles(files, agentName = 'agent') {
  const kept = []
  for (const file of files ?? []) {
    if (!isWritablePath(file.path)) {
      console.warn(
        `  ⚠ ${agentName} emitted ${file.path}, which is not a path it may write — discarding that block`
      )
      continue
    }
    kept.push(file)
  }
  return kept
}

/**
 * How a full engineer generation reaches disk.
 *
 * Three call sites used to write engineer output: the primary Phase 2c pass,
 * the post-critic revision, and the Phase 5 repair. The drop above was applied
 * at the first, added to the third after a repair overwrote __root.tsx, and
 * never reached the second (#296) — so a revision answering "the header is
 * wrong" could overwrite BrandLockup.tsx after the orchestrator wrote it, and
 * nothing logged it. The revision and the repair are patches now (#432) and
 * go through `applyEngineerPatch`, which applies the same drop before it
 * merges; this stays the one path for a whole generation.
 *
 * Mutates `result.files` so the archive records what was actually written.
 *
 * @param {{ files: Array<{path: string, content: string}> }} result
 * @param {string} agentLabel for the log line
 * @param {{ root: string, backup?: Map<string, string|null> }} options repo root to write under
 * @returns {Promise<string[]>} the paths written
 */
export async function writeEngineerFiles(result, agentLabel, { root, backup }) {
  result.files = dropUnwritableFiles(dropOrchestratorFiles(result.files, agentLabel), agentLabel)
  return await writeFiles(result.files, { root, backup })
}

/**
 * Snapshot the exact on-disk passing state: every mutable file plus any
 * extra path the agents wrote.
 * @param {import('./run-state.js').RunState} state
 * @returns {Promise<Map<string, string|null>>}
 */
export async function snapshotPassingState(state) {
  state.passingSnapshot = await backup([...new Set([...MUTABLE_FILES, ...state.writtenPaths])], {
    root: state.root,
  })
  return state.passingSnapshot
}

/**
 * Delete every file under app/components/generated/ that nothing on disk
 * imports, each recorded into the run's backup first so a rollback puts
 * it back (#448). Runs after every engineer write and before the build,
 * so a component from a previous night that today's files dropped never
 * reaches tsc or fallow. The required files live outside the directory
 * and are never candidates.
 * @param {import('./run-state.js').RunState} state
 * @param {3|5} phase
 * @param {string} after the write this sweep follows, for the trace
 */
export async function sweepAndTrace(state, phase, after) {
  const t0Sweep = Date.now()
  // Both maps a rollback may restore from. Once a build has passed, a
  // revision that fails to rebuild puts the passing snapshot back, and a
  // file swept out of that state has to be in it.
  const { kept, removed } = await sweepGenerated({
    root: state.root,
    backup: [state.originalBackup, state.passingSnapshot],
  })
  console.log(
    `  [generated-sweep] kept ${kept.length}, removed ${removed.length}${
      removed.length ? `: ${removed.join(', ')}` : ''
    }`
  )
  state.trace.addStep({
    name: 'generated-sweep',
    phase,
    input: { after },
    output: { kept, removed },
    durationMs: Date.now() - t0Sweep,
  })
}

/**
 * The user prompt for a repair or revision call: the engineer's files as
 * they stand on disk, the Art Director's preset read-only, and the
 * report verbatim. The system prompt is the engineer's own patch
 * variant (#447): every rule it was given, with the required-files
 * section and gate line stating the patch contract instead of the
 * full-generation one.
 * @param {import('./run-state.js').RunState} state
 * @param {string} errors a build error, or the critic's feedback plus the
 *   measured faults
 * @returns {Promise<{ owned: Array<{path: string, content: string}>, brief: string }>}
 */
export async function buildRepairBrief(state, errors) {
  const { root } = state
  state.engineer.repairBriefTemplate ??= await loadRepairBriefTemplate({ root })
  const owned = await readOwnedFiles(state.writtenPaths, FILE_OWNERSHIP, { root })
  return {
    owned,
    brief: renderRepairBrief(state.engineer.repairBriefTemplate, {
      owned,
      errors,
      preset: state.design.tokenContext,
    }),
  }
}

/**
 * Merge a patch reply over the owned files and apply it.
 *
 * The required-file and shell-posture check runs on the MERGED set: a
 * reply that changes one file omits every other required file by design,
 * so the reply alone can never pass it. When the merged set fails, nothing
 * is written and the problem comes back for the caller to spend the
 * attempt on. Otherwise the reply's files are written, its empty blocks
 * delete the owned files they name, and everything else stays as it is.
 *
 * Mutates `reply.files` to the merged set so the archive records what
 * shipped, not the three files the reply happened to carry.
 *
 * @param {import('./run-state.js').RunState} state
 * @param {Array<{path: string, content: string}>} owned from buildRepairBrief
 * @param {{ files: Array<{path: string, content: string}> }} reply
 * @param {string} label for the log lines
 * @param {3|5} [phase] the phase the sweep after the write is traced under
 * @returns {Promise<{ problem: import('../utils/engineer-output-check.js').OutputProblem|null,
 *   replied: number, written: number, deleted: number }>}
 */
export async function applyEngineerPatch(state, owned, reply, label, phase = 5) {
  const { root } = state
  // The error text has named __root.tsx before, which invites the agent to
  // "fix" a file it does not own.
  const files = dropUnwritableFiles(dropOrchestratorFiles(reply.files, label), label)
  const patch = mergeEngineerPatch(owned, files)
  const summary = {
    replied: files.length,
    written: patch.writes.length,
    deleted: patch.deletes.length,
  }
  const problem = findEngineerOutputProblem(patch.files, state.ad.chosenComposition.shell_posture)
  if (problem) return { problem, ...summary }

  for (const p of patch.ignoredDeletes) {
    console.warn(`  ⚠ ${label} emptied ${p}, which it does not own this run — ignoring`)
  }
  for (const p of await writeFiles(patch.writes, { root, backup: state.originalBackup }))
    state.writtenPaths.add(p)
  await deleteFiles(patch.deletes, { root, backup: state.originalBackup })
  reply.files = patch.files
  console.log(
    `  ${label}: ${summary.written} written, ${summary.deleted} deleted, ${patch.files.length} on disk`
  )
  // The merged set may have stopped importing a generated file; the
  // build that follows must not see it.
  await sweepAndTrace(state, phase, label)
  return { problem: null, ...summary }
}
