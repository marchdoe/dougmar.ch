/**
 * An Art Director retry asks for the rejected block, not the whole reply.
 *
 * The retry used to re-run the Art Director in full: 25-40k output tokens
 * re-typed to fix one field. It cost about $1.10 on 2 of the 5 nights before
 * 2026-09-28, both times over the MOBILE block alone (spec 11, 1a). The
 * mockup revisions already work this way (mockup-patch.js): the model is shown
 * its previous answer, returns only what changes, and the orchestrator puts
 * the change back into that answer. Here the unit of change is a delimiter
 * block, `===MOBILE===` or `===FILE:elements/preset.ts===`, because that is
 * the unit the validator rejects (validateArtDirectorResult names it as
 * `err.block`).
 *
 * The splice works on the raw reply text, so the result goes back through the
 * same parse and the same validation as a fresh reply. A block answer that
 * leaves out a block it was asked for fails the splice, and the caller falls
 * back to the full retry.
 *
 * @module
 */

/** Any delimiter line: `===NAME===` or `===FILE:path===`. */
const HEADER_LINE = /^===[A-Z_]+(?::[^=\n]+)?===[ \t]*$/m

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * The text without the one code fence a model sometimes wraps its whole reply
 * in. parseDelimiterResponse strips the same fence.
 * @param {string} text
 */
export function stripOuterFence(text) {
  const fence = /^```[^\n]*\n([\s\S]*)\n```\s*$/.exec(String(text ?? '').trim())
  return fence ? fence[1] : String(text ?? '')
}

/**
 * Where a block's body sits in a reply: from the line after its delimiter to
 * the next delimiter line or the end.
 * @param {string} raw
 * @param {string} name e.g. 'MOBILE' or 'FILE:elements/preset.ts'
 * @returns {{ start: number, end: number } | null} null when the block is absent
 */
function locateBlock(raw, name) {
  const header = new RegExp(`^===${escapeRegExp(name)}===[ \\t]*$`, 'm').exec(raw)
  if (!header) return null
  const lineEnd = raw.indexOf('\n', header.index)
  const start = lineEnd === -1 ? raw.length : lineEnd + 1
  const next = raw.slice(start).search(HEADER_LINE)
  return { start, end: next === -1 ? raw.length : start + next }
}

/**
 * A block's body, trimmed, or null when the reply has no such block.
 * @param {string} raw
 * @param {string} name
 * @returns {string|null}
 */
export function blockBody(raw, name) {
  const at = locateBlock(raw, name)
  return at ? raw.slice(at.start, at.end).trim() : null
}

/**
 * The reply with one block's body replaced, or the block appended when the
 * reply has none (a missing block is one of the rejections).
 * @param {string} raw
 * @param {string} name
 * @param {string} body
 * @returns {string}
 */
export function spliceBlock(raw, name, body) {
  const at = locateBlock(raw, name)
  if (!at) return `${raw.trimEnd()}\n\n===${name}===\n${body}\n`
  const tail = raw.slice(at.end)
  return `${raw.slice(0, at.start)}${body}\n${tail ? `\n${tail}` : ''}`
}

/**
 * Put a block answer's blocks into the previous reply.
 * @param {string} reply the previous, rejected reply
 * @param {string} answer the model's answer to the block request
 * @param {string[]} blocks the blocks it was asked for
 * @returns {{ ok: true, reply: string } | { ok: false, error: string }}
 */
export function spliceBlockAnswer(reply, answer, blocks) {
  const source = stripOuterFence(answer)
  let out = stripOuterFence(reply)
  for (const name of blocks) {
    const body = blockBody(source, name)
    if (!body) return { ok: false, error: `the block answer has no ===${name}=== block` }
    out = spliceBlock(out, name, body)
  }
  return { ok: true, reply: out }
}

/**
 * The retry context a block request carries: the reason, the blocks to
 * return, and the previous reply they go back into.
 * @param {{ reply: string, blocks: string[], reason: string }} request
 * @returns {string}
 */
export function blockRequest({ reply, blocks, reason }) {
  const names = blocks.map((b) => `===${b}===`).join(', ')
  return `## Previous attempt was rejected: return only ${names}

Your previous reply is below, in full. It was rejected for this reason:
${reason}

Return only the corrected ${names} ${blocks.length === 1 ? 'block' : 'blocks'}, each with its exact delimiter line and exact field formats. Do not repeat any other block: everything else in the previous reply stands and is kept as it is, so the corrected block has to agree with the composition, header, chassis and hero copy that reply already declares.

### Your previous reply

${stripOuterFence(reply)}`
}
