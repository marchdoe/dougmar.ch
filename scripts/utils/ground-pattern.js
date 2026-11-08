/**
 * Is this background a repeating pattern? (Spec 14 item 7, #794.)
 *
 * The owner rejected dot, halftone, ruled-line and blob grounds twice, so the
 * mockup pre-check (mockup-precheck.js) and the token gate (token-gate.js)
 * both ask this module the same question: the first over computed styles in
 * the page, the second over the styles the built page was compiled from.
 *
 * Three shapes, from what the 11 textured nights of 2026-10-18 to 10-31
 * actually drew:
 *
 *   repeating-gradient  repeating-linear-gradient and its radial and conic
 *                       siblings, the ruled-line ground
 *   dot-tile            a radial-gradient layer tiled under 40px, the dot and
 *                       halftone grounds
 *   blooms              three or more `radial-gradient(at X Y, ...)` layers
 *                       on one element, the mesh blob ground. Spec 14's text
 *                       names only the first two; its proof list requires the
 *                       three mesh nights to fail, and this is the clause the
 *                       2026-10-31 prototype caught them with.
 *
 * One soft bloom (2026-09-12 has one) and one positioned orb are not grounds,
 * so a single radial-gradient passes.
 *
 * @module
 */

/** A radial-gradient tile narrower than this is a dot pattern. */
export const TILE_MAX_PX = 40

/** This many positioned radial-gradient layers on one element is a mesh. */
export const BLOOM_MIN_LAYERS = 3

/**
 * Split a CSS list on its top-level commas, leaving the commas inside
 * `radial-gradient(...)` alone.
 * @param {string} value
 * @returns {string[]}
 */
function splitLayers(value) {
  const layers = []
  let depth = 0
  let current = ''
  for (const ch of value) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      layers.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) layers.push(current.trim())
  return layers
}

/** The tile width in px a background-size layer names, or null when it names none. */
function tileWidthPx(sizeLayer) {
  const m = /^([\d.]+)px\b/.exec(sizeLayer ?? '')
  return m ? Number(m[1]) : null
}

/**
 * Which repeating pattern a background paints, if any.
 *
 * @param {string|null|undefined} image a `background-image` value
 * @param {string|null|undefined} [size] the matching `background-size`; its
 *   layers repeat to fill the image's, as CSS does
 * @returns {'repeating-gradient'|'dot-tile'|'blooms'|null}
 */
export function classifyGroundPattern(image, size) {
  if (typeof image !== 'string') return null
  const layers = splitLayers(image)
  if (layers.some((l) => /^repeating-(linear|radial|conic)-gradient\(/.test(l))) {
    return 'repeating-gradient'
  }
  const sizes = splitLayers(size ?? '')
  const tiled = layers.some((layer, i) => {
    if (!layer.startsWith('radial-gradient(')) return false
    const px = tileWidthPx(sizes.length ? sizes[i % sizes.length] : null)
    return px !== null && px < TILE_MAX_PX
  })
  if (tiled) return 'dot-tile'
  const blooms = layers.filter((l) => /^radial-gradient\(\s*at\s/.test(l))
  return blooms.length >= BLOOM_MIN_LAYERS ? 'blooms' : null
}

/** How each pattern reads in a finding. */
export const PATTERN_LABEL = Object.freeze({
  'repeating-gradient': 'a repeating gradient (ruled lines)',
  'dot-tile': `a radial-gradient tiled under ${TILE_MAX_PX}px (a dot field)`,
  blooms: `${BLOOM_MIN_LAYERS} or more radial-gradient blooms (a mesh)`,
})

export const PATTERN_FIX =
  'Dot, halftone, ruled-line and blob grounds are banned. Make the ground a flat token colour, and use a solid colour field where the page needs mass.'
