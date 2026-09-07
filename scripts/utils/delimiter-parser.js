/**
 * Shared delimiter-block parser used by the orchestrator (for the
 * Unified Designer's ===FILE:===-formatted response) and by the Art
 * Director module (for its single bundled response containing hero copy,
 * archetype, chassis, visual spec, self-check, plus the preset.ts file).
 *
 * Lives outside design-agents.js to avoid a circular import between
 * design-agents.js and scripts/agents/art-director.js — both need this
 * parser, but design-agents.js imports the Art Director and the Art
 * Director needs the parser.
 *
 * @param {string} result - raw response text
 * @param {{ keepEmptyFiles?: boolean }} [options] `keepEmptyFiles` keeps a
 *   `===FILE:path===` block with nothing after it as `{ path, content: '' }`.
 *   Off by default: for a full generation an empty block is a slip and is
 *   dropped, as it always was. A repair reply (#432) is a patch, and there an
 *   empty block is the one way to say "delete this file".
 * @returns {{
 *   files: Array<{path: string, content: string}>,
 *   rationale?: string,
 *   design_brief?: string,
 *   color_scheme?: object,
 *   hero_copy?: string,
 *   hero_rationale?: string,
 *   archetype?: string,
 *   chassis_id?: string,
 *   visual_spec?: string,
 *   self_check?: string,
 *   measurables?: string,
 *   shell?: string,
 *   header?: string,
 *   mobile?: string,
 *   interior_notes?: string,
 *   hero_source?: string,
 *   composition?: string,
 *   composition_rationale?: string,
 * }}
 */
export function parseDelimiterResponse(result, { keepEmptyFiles = false } = {}) {
  const files = []
  const sentinel = '\n===END_SENTINEL===\n'
  // Strip outer markdown code fence if the model wraps its entire response.
  // Without this, the last block before the closing ``` captures the fence
  // markers as content (e.g. "Specimen\n```" instead of "Specimen").
  const fenceMatch = /^```[^\n]*\n([\s\S]*)\n```\s*$/.exec(result.trim())
  const src = fenceMatch ? fenceMatch[1] : result
  const withSentinel = src + sentinel
  const filePattern =
    /^===FILE:([^=\n]+)===\s*\n([\s\S]*?)(?=^===FILE:|^===RATIONALE===|^===DESIGN_BRIEF===|^===COLOR_SCHEME===|^===HERO_COPY===|^===HERO_RATIONALE===|^===HERO_SOURCE===|^===ARCHETYPE===|^===CHASSIS_ID===|^===VISUAL_SPEC===|^===SELF_CHECK===|^===MEASURABLES===|^===SHELL===|^===HEADER===|^===MOBILE===|^===COMPOSITION===|^===COMPOSITION_RATIONALE===|^===INTERIOR_NOTES===|^===END_SENTINEL===)/gm
  for (const match of withSentinel.matchAll(filePattern)) {
    const filePath = match[1].trim()
    const content = match[2].trim()
    if (filePath && (content || keepEmptyFiles)) {
      files.push({ path: filePath, content })
    }
  }

  const captureBlock = (name) => {
    const re = new RegExp(`^===${name}===\\s*\\n([\\s\\S]*?)(?=^===)`, 'm')
    const m = withSentinel.match(re)
    return m ? m[1].trim() : undefined
  }

  const rationale = captureBlock('RATIONALE')
  const design_brief = captureBlock('DESIGN_BRIEF')
  const hero_copy = captureBlock('HERO_COPY')
  const hero_rationale = captureBlock('HERO_RATIONALE')
  const hero_source = captureBlock('HERO_SOURCE')
  const archetype = captureBlock('ARCHETYPE')
  const chassis_id = captureBlock('CHASSIS_ID')
  const visual_spec = captureBlock('VISUAL_SPEC')
  const self_check = captureBlock('SELF_CHECK')
  const measurables = captureBlock('MEASURABLES')
  const shell = captureBlock('SHELL')
  const header = captureBlock('HEADER')
  const mobile = captureBlock('MOBILE')
  const composition = captureBlock('COMPOSITION')
  const composition_rationale = captureBlock('COMPOSITION_RATIONALE')
  const interior_notes = captureBlock('INTERIOR_NOTES')

  let color_scheme
  const schemeRaw = captureBlock('COLOR_SCHEME')
  if (schemeRaw !== undefined) {
    try {
      color_scheme = JSON.parse(schemeRaw)
    } catch {
      color_scheme = { __parse_error: true, raw: schemeRaw }
    }
  }

  return {
    files,
    rationale,
    design_brief,
    color_scheme,
    hero_copy,
    hero_rationale,
    hero_source,
    archetype,
    chassis_id,
    visual_spec,
    self_check,
    measurables,
    shell,
    header,
    mobile,
    composition,
    composition_rationale,
    interior_notes,
  }
}
