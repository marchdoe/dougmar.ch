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

/**
 * Read signals/taste.md (owner-curated, permanent taste memory) and return
 * a prompt-ready markdown block. Pure I/O + trim — no LLM calls.
 *
 * @param {string} root - repo root (taste.md lives at <root>/signals/taste.md)
 * @returns {string} markdown block, or '' when the file is absent/empty
 */
export function buildTasteMemoryBlock(root) {
  const tastePath = path.join(root, 'signals', 'taste.md')
  if (!existsSync(tastePath)) return ''

  let raw
  try {
    raw = readFileSync(tastePath, 'utf8').trim()
  } catch {
    return ''
  }
  if (!raw) return ''

  let body = raw
  if (Buffer.byteLength(body, 'utf8') > MAX_BYTES) {
    // Truncate on a character boundary that still fits within MAX_BYTES,
    // then note the truncation so the model knows the file runs longer.
    while (Buffer.byteLength(body, 'utf8') > MAX_BYTES && body.length > 0) {
      body = body.slice(0, -1)
    }
    body = `${body.trimEnd()}\n\n*(truncated — signals/taste.md exceeds the ${MAX_BYTES / 1024}KB prompt cap; trim the file)*`
  }

  return ['## Owner Taste Memory (permanent — these override recent trends)', '', body].join('\n')
}
