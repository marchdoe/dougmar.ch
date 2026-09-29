/**
 * The in-page half of the pixel contrast probe (spec 11, 1c).
 *
 * The `page*` functions run in the browser on the kit `text-contrast-page.js`
 * builds (see `runPageKit`), with the #566 walk's own functions in it, so a
 * text is found, described and judged unresolved by the same code that
 * reported it `contrast-unresolved`. The arithmetic is `pixel-contrast.js`.
 *
 * For each unresolved text, small or large, in document order up to a cap:
 * mark the element, make its text transparent with a stylesheet (colour,
 * fill, stroke, shadow and decoration; transitions off so the change is not
 * animated; its box, ground and layout untouched), screenshot the box of its
 * own text nodes, and take the mark off again. The PNG is decoded on a canvas
 * in the page, the way `downscaleForCritic` does it, and every pixel row
 * inside the glyph band of each of the text's lines (from its tallest glyph's
 * top to its lowest glyph's bottom, not the padded element box) goes back to
 * Node, strided across its width.
 *
 * Text under `aria-hidden="true"`, on the element or any ancestor, is not
 * probed: 2026-09-25 set a 547px italic "fun" as texture behind the hero,
 * hidden from readers on purpose, and a floor for reading it means nothing.
 *
 * A text inside the marked element takes the transparency too: it sits in
 * the same box and is not the ground. Every other text on the page is left
 * as it is, because a display word set behind a label is the label's ground.
 *
 * @module
 */

import { PIXEL_CONTRAST_OPTIONS } from './pixel-contrast.js'
import { runPageKit, TEXT_CONTRAST_PAGE_FUNCTIONS } from './text-contrast-page.js'

/** The product of the opacities from the text up: they dim the ink over whatever is behind. */
function pageGroupOpacity(layers) {
  return layers.reduce((o, layer) => o * layer.opacity, 1)
}

/** The box of the element's own text in whole viewport pixels, or null when it has none on screen. */
function pageProbeBox(el, kit) {
  const box = kit.textBox(el)
  if (!box) return null
  const x = Math.max(0, Math.floor(box.left))
  const y = Math.max(0, Math.floor(box.top))
  const right = Math.min(document.documentElement.clientWidth, Math.ceil(box.right))
  const bottom = Math.min(window.innerHeight, Math.ceil(box.bottom))
  if (right - x < 1 || bottom - y < 1) return null
  return { x, y, width: right - x, height: bottom - y }
}

/**
 * Where the glyphs sit inside a line's content area, in px from its top: from
 * the tallest glyph's top to the lowest glyph's bottom, read off a canvas in
 * the element's font. The content area runs from the font's ascent to its
 * descent, which is room the glyphs of a small-caps label never reach: 09-24
 * put a hairline rule at the very top of one and it crossed no letter. Null
 * when the canvas cannot say, and the whole content area is used.
 */
function pageGlyphBand(cs, text) {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return null
  ctx.font = cs.font || `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  const m = ctx.measureText(cs.textTransform === 'uppercase' ? text.toUpperCase() : text)
  const top = m.fontBoundingBoxAscent - m.actualBoundingBoxAscent
  const bottom = m.fontBoundingBoxAscent + m.actualBoundingBoxDescent
  return Number.isFinite(top) && Number.isFinite(bottom) && bottom > top ? { top, bottom } : null
}

/**
 * The glyph band of each line of the element's own text nodes, relative to
 * its probe box. A fragment narrower than half an em (a space left at a line
 * end) holds no glyph and is dropped: its rows are all ground.
 */
function pageLineBoxes(seen, box, sizePx, kit) {
  const band = kit.glyphBand(seen.cs, seen.text)
  const lines = []
  for (const n of seen.el.childNodes) {
    if (n.nodeType !== 3 || !/\S/.test(n.nodeValue)) continue
    const range = document.createRange()
    range.selectNodeContents(n)
    for (const r of range.getClientRects()) {
      const line = kit.lineRect(r, box, band, sizePx)
      if (line) lines.push(line)
    }
  }
  return lines
}

/** One line's glyph band inside the probe box, relative to it, or null when it holds no glyph. */
function pageLineRect(r, box, band, sizePx) {
  const x = Math.max(box.x, Math.floor(r.left))
  const y = Math.max(box.y, Math.floor(r.top + (band?.top ?? 0)))
  const width = Math.min(box.x + box.width, Math.ceil(r.right)) - x
  const bottom = band ? Math.min(r.bottom, r.top + band.bottom) : r.bottom
  const height = Math.min(box.y + box.height, Math.ceil(bottom)) - y
  return width >= sizePx / 2 && height >= 1 ? { x: x - box.x, y: y - box.y, width, height } : null
}

function pageProbeTarget(seen, c, box, kit) {
  return {
    key: `${c.selector}|${c.unresolved}`,
    selector: c.selector,
    text: c.text,
    sizePx: c.sizePx,
    weight: c.weight,
    large: kit.isLarge(seen.cs),
    fg: { ...c.fg, a: (c.fg.a ?? 1) * kit.groupOpacity(c.layers) },
    unresolved: c.unresolved,
    part: c.part,
    outlined: c.outlined,
    box,
    lines: kit.lineBoxes(seen, box, c.sizePx),
  }
}

/**
 * Every unresolved text as a probe target, and the keys of those past the
 * cap or with no box on screen. The elements are kept on `window` for the
 * calls that hide and show them.
 */
function pageProbeTargets(kit) {
  const targets = []
  const skipped = new Set()
  const elements = []
  for (const el of document.body.querySelectorAll('*')) {
    const seen = el.closest('[aria-hidden="true"]') ? null : kit.inspect(el)
    if (!seen) continue
    const c = kit.buildCandidate(seen)
    if (!c.unresolved) continue
    const box = targets.length < kit.options.maxProbes ? kit.probeBox(el) : null
    if (!box) {
      skipped.add(`${c.selector}|${c.unresolved}`)
      continue
    }
    elements.push(el)
    targets.push(kit.probeTarget(seen, c, box))
  }
  window.__pixelContrastTargets = elements
  return { targets, skipped: [...skipped] }
}

/** Put the stylesheet that makes a marked element's text transparent in the page. */
function pageInstallHide() {
  const mark = 'data-pixel-contrast-hide'
  const style = document.createElement('style')
  style.setAttribute(`${mark}-sheet`, '')
  style.textContent =
    `[${mark}], [${mark}] * { color: transparent !important; ` +
    '-webkit-text-fill-color: transparent !important; ' +
    '-webkit-text-stroke-color: transparent !important; ' +
    'text-decoration-color: transparent !important; text-shadow: none !important; ' +
    'caret-color: transparent !important; transition: none !important; }'
  document.head.appendChild(style)
}

function pageSetHidden(kit) {
  const el = window.__pixelContrastTargets?.[kit.options.index]
  if (!el) return
  if (kit.options.hidden) el.setAttribute('data-pixel-contrast-hide', '')
  else el.removeAttribute('data-pixel-contrast-hide')
}

function pageUninstallHide() {
  document.querySelector('style[data-pixel-contrast-hide-sheet]')?.remove()
  for (const el of document.querySelectorAll('[data-pixel-contrast-hide]')) {
    el.removeAttribute('data-pixel-contrast-hide')
  }
  delete window.__pixelContrastTargets
}

/**
 * The pixel rows inside each line box of a PNG, each as flat r, g, b, strided
 * across its width to at most `maxColumns`. Every row is kept: a 1px rule is
 * one row.
 */
async function pageDecodeRows(kit) {
  const { base64, lines, maxColumns } = kit.options
  const img = new Image()
  img.src = `data:image/png;base64,${base64}`
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const rows = []
  for (const line of lines) {
    const step = Math.max(1, Math.ceil(line.width / maxColumns))
    for (let y = line.y; y < Math.min(line.y + line.height, canvas.height); y++) {
      const row = []
      for (let x = line.x; x < Math.min(line.x + line.width, canvas.width); x += step) {
        const i = (y * canvas.width + x) * 4
        row.push(data[i], data[i + 1], data[i + 2])
      }
      rows.push(row)
    }
  }
  return rows
}

/** The #566 kit, plus what finds the targets. */
export const PIXEL_CONTRAST_PAGE_FUNCTIONS = {
  ...TEXT_CONTRAST_PAGE_FUNCTIONS,
  groupOpacity: pageGroupOpacity,
  probeBox: pageProbeBox,
  glyphBand: pageGlyphBand,
  lineBoxes: pageLineBoxes,
  lineRect: pageLineRect,
  probeTarget: pageProbeTarget,
  probeTargets: pageProbeTargets,
}

/** One target's pixels with its text hidden. Its mark always comes off again. */
async function sampleTarget(page, target, index, options) {
  let png
  try {
    await runPageKit(page, { setHidden: pageSetHidden }, 'setHidden', { index, hidden: true })
    png = await page.screenshot({ type: 'png', clip: target.box })
  } finally {
    await runPageKit(page, { setHidden: pageSetHidden }, 'setHidden', { index, hidden: false })
  }
  return runPageKit(page, { decodeRows: pageDecodeRows }, 'decodeRows', {
    base64: png.toString('base64'),
    lines: target.lines,
    maxColumns: options.maxColumns,
  })
}

/** Sample every target, and the keys whose every instance was sampled. */
async function sampleTargets(page, { targets, skipped }, options) {
  const failed = new Set(skipped)
  const probes = []
  await runPageKit(page, { installHide: pageInstallHide }, 'installHide', {})
  try {
    for (const [index, target] of targets.entries()) {
      if (!target.lines.length) {
        failed.add(target.key)
        continue
      }
      try {
        probes.push({ ...target, rows: await sampleTarget(page, target, index, options) })
      } catch {
        failed.add(target.key)
      }
    }
  } finally {
    await runPageKit(page, { uninstallHide: pageUninstallHide }, 'uninstallHide', {})
  }
  const probed = [...new Set(probes.map((p) => p.key))].filter((k) => !failed.has(k))
  return { probes, probed }
}

/**
 * Probe every unresolved text on a page as it stands. Run it where the #566
 * walk runs, with the page revealed (`withRevealedPage`), so the two see the
 * same texts in the same state.
 *
 * `probed` is the keys (`selector|unresolved`) whose every instance was
 * sampled: the CSS walk drops its `contrast-unresolved` warning for those.
 * A key with an instance past the cap, off screen, or whose screenshot threw
 * keeps its warning. Null when the probe could not run at all, which leaves
 * every warning in place and never takes the measurement beside it down.
 *
 * @param {import('playwright').Page} page
 * @param {typeof PIXEL_CONTRAST_OPTIONS} [options]
 * @returns {Promise<{ probes: Array<object>, probed: string[] }|null>}
 */
export async function probePixelContrast(page, options = PIXEL_CONTRAST_OPTIONS) {
  try {
    const found = await runPageKit(page, PIXEL_CONTRAST_PAGE_FUNCTIONS, 'probeTargets', options)
    return found ? await sampleTargets(page, found, options) : null
  } catch (err) {
    console.warn(`  [pixel-contrast] not probed (non-blocking): ${err.message}`)
    return null
  }
}
