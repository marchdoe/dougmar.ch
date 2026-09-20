/**
 * Deterministic backstop for `shell_posture: none` — the composition axis
 * (see utils/composition-grammar.js) that means "no nav element at all; the
 * page navigates through in-content links only." Prompt instructions alone
 * don't guarantee this: the React Engineer can silently emit a `<nav>` out
 * of habit, and until now nothing caught it before the build shipped.
 *
 * A pure predicate so the retry-with-reminder wiring stays in the
 * orchestrator. engineer-output-check.js combines it with the required-files
 * check into the one problem the orchestrator retries on.
 */

/**
 * @param {Array<{ path: string, content: string }>} files
 * @param {string|null|undefined} shellPosture
 * @returns {string[]} the paths whose content holds a <nav> element, in file
 *   order; empty for any posture but `none`
 */
export function findNavOffenders(files, shellPosture) {
  if (shellPosture !== 'none') return []
  return (files || []).filter((f) => /<nav[\s>]/.test(f.content || '')).map((f) => f.path)
}

/**
 * @param {Array<{ path: string, content: string }>} files
 * @param {string|null|undefined} shellPosture
 * @returns {string|null} a violation message, or null if the files respect
 *   the declared posture (always null when shellPosture isn't 'none')
 */
export function findShellPostureViolation(files, shellPosture) {
  const offenders = findNavOffenders(files, shellPosture)
  if (offenders.length === 0) return null

  return `shell_posture: none declares no nav element, but <nav> appears in: ${offenders.join(', ')}`
}
