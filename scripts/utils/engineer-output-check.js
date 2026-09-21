/**
 * What the React Engineer's output must satisfy before it reaches disk.
 *
 * Two checks used to live in the orchestrator as two separate
 * retry-with-reminder blocks, one after the other. The posture retry rebuilt
 * from the original prompt and was accepted on the sole condition that it no
 * longer violated posture, so it could re-drop the required files the
 * previous retry had just restored (#298). One predicate over both, applied to
 * the merged set after every patch, closes that gap and any like it.
 *
 * Pure: the wiring stays in the orchestrator (engineer-output-patch.js asks
 * for the fix), as with shell-posture-check.js. A problem's `reminder` is
 * written as the report of a repair brief, so it asks for a patch and names
 * each file at fault.
 */

import { ALLOWED_EXACT, ALLOWED_WRITE_PREFIXES, isWritablePath } from './file-manager.js'
import { findNavOffenders, findShellPostureViolation } from './shell-posture-check.js'

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

/** The allowlist as prose, for the report. */
function allowlistSummary() {
  return [
    ...ALLOWED_WRITE_PREFIXES.map((p) => `- anything under ${p}`),
    ...[...ALLOWED_EXACT].map((p) => `- ${p}`),
  ].join('\n')
}

/**
 * What each required file has to hold, for a patch that writes one from
 * nothing. Only the hard rules from react-engineer.md; the design itself
 * comes from the files on disk, which the brief prints.
 */
const REQUIRED_FILE_CONTRACT = {
  'app/components/Layout.tsx':
    'the site shell: `export function Layout`, which imports and renders Sidebar and wraps `{children}`',
  'app/components/Sidebar.tsx':
    'the navigation: `export function Sidebar`, taking the props Layout.tsx passes it',
  'app/routes/index.tsx':
    "the home page: `export const Route = createFileRoute('/')({ component })`, page content only, never wrapped in Layout",
  'app/routes/about.tsx':
    "the about page: `export const Route = createFileRoute('/about')({ component })`, page content only, never wrapped in Layout",
  'app/routes/work.$slug.tsx':
    "the case study page: `export const Route = createFileRoute('/work/$slug')({ component })`, reading `Route.useParams()`, never wrapped in Layout",
  'app/routes/og.tsx':
    "the share card: `export const Route = createFileRoute('/og')({ component })`, one fixed 1200x630 card that covers the shell",
}

/**
 * The files that would not be written, printed so the engineer can move them.
 * They are not on disk, so the repair brief's listing cannot show them.
 * @param {Array<{ path: string, content: string }>} files
 * @param {string[]} unwritable
 * @returns {string}
 */
function rejectedFilesListing(files, unwritable) {
  return files
    .filter((f) => unwritable.includes(f.path))
    .map((f) => `--- ${f.path} (not written) ---\n${f.content}\n--- end ${f.path} ---`)
    .join('\n\n')
}

/**
 * @typedef {object} OutputProblem
 * @property {'missing-files'|'unwritable-path'|'shell-posture'} kind
 * @property {string} message one line for the log
 * @property {string} reminder the problem as the report of a repair brief: it
 *   names each file at fault and asks for a patch, not a new generation
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
        `## REQUIRED FILES MISSING\n\n` +
        `These required files are missing:\n\n` +
        missing.map((m) => `- ${m}: ${REQUIRED_FILE_CONTRACT[m]}`).join('\n') +
        `\n\nA required file left out keeps yesterday's version of it under today's design, ` +
        `so every one of them has to exist once your reply is applied. Return each one ` +
        `complete, at exactly the path shown. One that is not among the files listed above ` +
        `you write against those files, using the exports and props they already import and ` +
        `pass. Also return any listed file that has to change to fit, and leave every ` +
        `other file alone.`,
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
        `## FILE PATH NOT YOURS\n\n` +
        `These paths are not yours to write, so nothing was written to them: ${unwritable.join(', ')}\n\n` +
        `You may write:\n${allowlistSummary()}\n\n` +
        `A new component belongs under \`app/components/generated/\`, not beside the ` +
        `hand-written ones in \`app/components/\`. The rejected files follow, since they are not ` +
        `on disk. Return each one at a path you may write, and every file listed above that ` +
        `imports it, with the import updated to match.\n\n` +
        rejectedFilesListing(files, unwritable),
    }
  }

  const violation = findShellPostureViolation(files, shellPosture)
  if (violation) {
    return {
      kind: 'shell-posture',
      message: violation,
      reminder:
        `## SHELL POSTURE VIOLATION\n\n${violation}\n\n` +
        '`shell_posture: none` means no <nav> element anywhere in the output; ' +
        'navigation happens through in-content links only. Return each of these files ' +
        'with every <nav> removed and nothing else changed:\n' +
        findNavOffenders(files, shellPosture)
          .map((p) => `- ${p}`)
          .join('\n'),
    }
  }

  return null
}
