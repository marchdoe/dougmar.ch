/**
 * What the React Engineer's output must satisfy before it reaches disk.
 *
 * Two checks used to live in the orchestrator as two separate
 * retry-with-reminder blocks, one after the other. The posture retry rebuilt
 * from the original prompt and was accepted on the sole condition that it no
 * longer violated posture, so it could re-drop the required files the
 * previous retry had just restored (#298). One predicate over both, and one
 * loop that accepts only a clean result, closes that gap and any like it.
 *
 * Pure: the retry wiring stays in the orchestrator, as with
 * shell-posture-check.js.
 */

import { ALLOWED_EXACT, ALLOWED_WRITE_PREFIXES, isWritablePath } from './file-manager.js'
import { findShellPostureViolation } from './shell-posture-check.js'

/**
 * Files the engineer must emit every night. Omitting Layout.tsx or
 * Sidebar.tsx silently preserves yesterday's nav and produces the "designs
 * all look the same" complaint.
 */
export const REQUIRED_FILES = [
  'app/components/Layout.tsx',
  'app/components/Sidebar.tsx',
  'app/routes/index.tsx',
  'app/routes/about.tsx',
  'app/routes/work.$slug.tsx',
  'app/routes/og.tsx',
]

/**
 * @param {Array<{ path: string }>} files
 * @returns {string[]} required paths absent from the output, in REQUIRED_FILES order
 */
export function findMissingRequiredFiles(files) {
  const produced = new Set((files || []).map((f) => f.path))
  return REQUIRED_FILES.filter((p) => !produced.has(p))
}

/**
 * Paths in the response the engineer is not allowed to write.
 *
 * @param {Array<{ path: string }>} files
 * @returns {string[]}
 */
export function findUnwritablePaths(files) {
  return (files || []).map((f) => f.path).filter((p) => !isWritablePath(p))
}

/** The allowlist as prose, for the retry reminder. */
function allowlistSummary() {
  return [
    ...ALLOWED_WRITE_PREFIXES.map((p) => `- anything under ${p}`),
    ...[...ALLOWED_EXACT].map((p) => `- ${p}`),
  ].join('\n')
}

/**
 * @typedef {object} OutputProblem
 * @property {'missing-files'|'unwritable-path'|'shell-posture'} kind
 * @property {string} message one line for the log
 * @property {string} reminder the section appended to the engineer's prompt on retry
 */

/**
 * The first problem with an engineer response, or null when it is acceptable.
 *
 * Missing files are reported before a posture violation: a response that
 * omitted Sidebar.tsx cannot be judged on whether Sidebar.tsx has a nav.
 *
 * @param {Array<{ path: string, content: string }>} files
 * @param {string|null|undefined} shellPosture the composition's shell_posture
 * @returns {OutputProblem|null}
 */
export function findEngineerOutputProblem(files, shellPosture) {
  const missing = findMissingRequiredFiles(files)
  if (missing.length > 0) {
    return {
      kind: 'missing-files',
      message: `React Engineer omitted required files: ${missing.join(', ')}`,
      reminder:
        `## REQUIRED FILES MISSING — RETRY\n\n` +
        `Your previous response omitted these required files: ${missing.join(', ')}\n\n` +
        `This silently preserves yesterday's chrome and breaks the day's archetype. ` +
        `Re-emit your COMPLETE response. Every required file must appear, including these you missed:\n` +
        missing.map((m) => `- ${m}`).join('\n'),
    }
  }

  // Before posture, because a file that cannot be written is not a file this
  // response has yet. Reported here so the engineer moves it and fixes the
  // import in one go; the write boundary also drops it, but a drop alone
  // leaves an import pointing at nothing.
  const unwritable = findUnwritablePaths(files)
  if (unwritable.length > 0) {
    return {
      kind: 'unwritable-path',
      message: `React Engineer wrote outside its allowlist: ${unwritable.join(', ')}`,
      reminder:
        `## FILE PATH NOT YOURS — RETRY\n\n` +
        `These paths are not yours to write: ${unwritable.join(', ')}\n\n` +
        `You may write:\n${allowlistSummary()}\n\n` +
        `A new component belongs under \`app/components/generated/\`, not beside the ` +
        `hand-written ones in \`app/components/\`. Re-emit your COMPLETE response with ` +
        `every such file moved there and every import that names it updated to match.`,
    }
  }

  const violation = findShellPostureViolation(files, shellPosture)
  if (violation) {
    return {
      kind: 'shell-posture',
      message: violation,
      reminder:
        `## SHELL POSTURE VIOLATION — RETRY\n\n${violation}\n\n` +
        '`shell_posture: none` means no <nav> element anywhere in the output — ' +
        'navigation happens through in-content links only. Re-emit your COMPLETE response with every <nav> removed.',
    }
  }

  return null
}
