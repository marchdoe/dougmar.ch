import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

// signals/taste.md is owner-curated and hand-edited, not agent-generated —
// unlike the rolling ratings/lessons windows (10-14 build lookback), this is
// permanent, all-time truth that survives forever. Hard-cap it so a future
// edit can't silently blow the prompt budget the way an unbounded reference
// or lessons block can.
// 8KB. On 2026-09-04 the file was 5,638 bytes against a 3KB cap, so five
// standing complaints and the whole grade ledger were cut off before the Art
// Director ever read them — a "do not repeat" list the director could not
// see. This is the owner's only taste channel that never expires, and at
// roughly 2k tokens it is among the cheapest things in a prompt that runs
// tens of thousands. Raise it again rather than let the tail fall off; the
// truncation notice is the signal that it needs raising.
export const MAX_TASTE_MEMORY_BYTES = 16 * 1024
const MAX_BYTES = MAX_TASTE_MEMORY_BYTES

// signals/voice.md (#504) is the same kind of file: first person, hand-written,
// never touched by the pipeline. Under 60 lines by its own rule, so the cap
// is the taste file's and will not be reached.
export const MAX_VOICE_BYTES = MAX_TASTE_MEMORY_BYTES

/**
 * Read one owner-curated file under signals/ and return a prompt-ready
 * markdown block: heading, blank line, the file trimmed and capped. Pure
 * I/O + trim, no LLM calls. Shared by the taste and voice blocks so the two
 * cannot drift in how they read, trim or truncate.
 *
 * @param {string} root - repo root
 * @param {string} name - file name under <root>/signals/
 * @param {string} heading - the markdown heading for the block
 * @param {number} maxBytes - prompt cap for the body
 * @returns {string} markdown block, or '' when the file is absent/empty
 */
function buildOwnerBlock(root, name, heading, maxBytes) {
  const file = path.join(root, 'signals', name)
  if (!existsSync(file)) return ''

  let raw
  try {
    raw = readFileSync(file, 'utf8').trim()
  } catch {
    return ''
  }
  if (!raw) return ''

  let body = raw
  if (Buffer.byteLength(body, 'utf8') > maxBytes) {
    // Truncate on a character boundary that still fits within maxBytes,
    // then note the truncation so the model knows the file runs longer.
    while (Buffer.byteLength(body, 'utf8') > maxBytes && body.length > 0) {
      body = body.slice(0, -1)
    }
    body = `${body.trimEnd()}\n\n*(truncated — signals/${name} exceeds the ${maxBytes / 1024}KB prompt cap; trim the file)*`
  }

  return [heading, '', body].join('\n')
}

/**
 * Read signals/taste.md (owner-curated, permanent taste memory) and return
 * a prompt-ready markdown block. Pure I/O + trim — no LLM calls.
 *
 * @param {string} root - repo root (taste.md lives at <root>/signals/taste.md)
 * @returns {string} markdown block, or '' when the file is absent/empty
 */
export function buildTasteMemoryBlock(root) {
  return buildOwnerBlock(
    root,
    'taste.md',
    '## Owner Taste Memory (permanent — these override recent trends)',
    MAX_BYTES
  )
}

/**
 * Read signals/voice.md (the owner's voice, first person) and return a
 * prompt-ready markdown block, the same way as the taste block. The Art
 * Director reads it beside the taste memory so hero and deck lines have a
 * register to match.
 *
 * @param {string} root - repo root (voice.md lives at <root>/signals/voice.md)
 * @returns {string} markdown block, or '' when the file is absent/empty
 */
export function buildVoiceBlock(root) {
  return buildOwnerBlock(
    root,
    'voice.md',
    '## Owner Voice (permanent. Hero and deck copy sounds like this, never like the pipeline)',
    MAX_VOICE_BYTES
  )
}
