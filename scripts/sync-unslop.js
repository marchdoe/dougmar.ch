/**
 * Vendor the owner's unslop pattern list into the repo.
 *
 * The standing rule for anything authored is the pattern list at
 * `~/.claude/skills/unslop/SKILL.md` (#504). The nightly agents run in CI,
 * where that file does not exist, so the list they read lives at
 * `scripts/prompts/unslop.md`: the skill file verbatim, under a header that
 * says where it came from. `pnpm unslop:sync` refreshes the copy when the
 * skill is present and does nothing, successfully, when it is not.
 *
 * The header is re-inserted on every sync, so the vendored file always says
 * it is generated no matter how many times the source changes.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { isMain } from './utils/cli.js'
import { ROOT } from './utils/file-manager.js'

export const SKILL_SOURCE = path.join(homedir(), '.claude', 'skills', 'unslop', 'SKILL.md')
export const VENDORED_TARGET = path.join(ROOT, 'scripts', 'prompts', 'unslop.md')

/**
 * The note at the top of the vendored copy. One HTML comment, so a prompt
 * that embeds the file carries it without the model reading it as a rule.
 */
export const GENERATED_HEADER = [
  '<!-- Generated from ~/.claude/skills/unslop/SKILL.md by scripts/sync-unslop.js.',
  '     Do not edit this copy. Edit the skill, then run `pnpm unslop:sync`. -->',
  '',
  '',
].join('\n')

/**
 * Copy the skill file over the vendored one, header first.
 *
 * @param {{ source?: string, target?: string }} [opts]
 * @returns {{ synced: boolean, reason: string }}
 */
export function syncUnslop({ source = SKILL_SOURCE, target = VENDORED_TARGET } = {}) {
  if (!existsSync(source)) {
    return { synced: false, reason: `no skill file at ${source}; leaving ${target} as it is` }
  }
  const body = readFileSync(source, 'utf8')
  writeFileSync(target, `${GENERATED_HEADER}${body}`, 'utf8')
  return { synced: true, reason: `wrote ${target} from ${source}` }
}

if (isMain(import.meta.url)) {
  const { reason } = syncUnslop()
  console.log(`[unslop:sync] ${reason}`)
}
