/**
 * Capture a static HTML snapshot of the portfolio site.
 *
 * Starts `vite preview` on a temporary port, crawls each portfolio route,
 * inlines CSS, strips JS, rewrites nav links, and saves self-contained HTML files.
 *
 * @module
 */

import { spawn } from 'node:child_process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'
import { ROOT } from './file-manager.js'
import { STEP_BUDGETS } from './budgets.js'
import { FINGERPRINT_VIEWPORT, collectGeometry } from './geometry-fingerprint.js'
import { measureDesignFidelity } from './design-fidelity.js'
import { hasFirstPaintMotion } from './motion-grammar.js'

/** MIME type per client-mark extension, for the data: URI the snapshot inlines (#505). */
const IMAGE_MIME = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

/**
 * Inline CSS, strip JavaScript, and rewrite nav links for self-contained browsing.
 * Exported for its tests; captureSnapshot is the only production caller.
 * @param {string} html - raw HTML from the server
 * @param {string} baseUrl - e.g. "http://localhost:14321"
 * @returns {Promise<string>} processed HTML
 */
export async function processHtml(html, baseUrl) {
  // 1. Inline CSS: find <link rel="stylesheet" href="..."> tags
  //    Fetch each CSS URL from the running server, replace <link> with <style>
  const cssLinkRegex = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi
  let processed = html
  const cssLinks = [...html.matchAll(cssLinkRegex)]
  for (const match of cssLinks) {
    const cssUrl = match[1]
    const fullUrl = cssUrl.startsWith('http') ? cssUrl : `${baseUrl}${cssUrl}`
    // Skip Google Fonts CSS (keep as external link)
    if (fullUrl.includes('fonts.googleapis.com')) continue
    try {
      const cssResp = await fetch(fullUrl)
      const cssText = await cssResp.text()
      processed = processed.replace(match[0], `<style>${cssText}</style>`)
    } catch {
      // Leave the link tag if fetch fails
    }
  }

  // 2. Remove all <script> tags and their contents
  processed = processed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // 3. Rewrite nav links for self-contained browsing
  processed = processed.replace(/href="\/"(?=[^a-z])/g, 'href="index.html"')
  processed = processed.replace(/href="\/about"/g, 'href="about.html"')
  processed = processed.replace(/href="\/work\/([^"]+)"/g, 'href="work/$1.html"')

  // 4. Inline the client marks (#505). `<img src="/clients/rolex.svg">` is
  //    the one image source the engineer may use. The path resolves on the
  //    live domain, where public/ is served, and nowhere else: a snapshot
  //    opened from disk sits at archive/<date>/site/ or one level deeper, and
  //    no relative rewrite is right for both of those and for the served copy
  //    under public/archive/. So the file is fetched from the preview server
  //    and inlined as a data: URI, the way the stylesheet is, and the page
  //    stays self-contained. A fetch failure leaves the src as it was.
  const markSrcs = [
    ...new Set([...processed.matchAll(/src="(\/clients\/[^"]+)"/g)].map((m) => m[1])),
  ]
  for (const src of markSrcs) {
    const mime = IMAGE_MIME[src.slice(src.lastIndexOf('.') + 1).toLowerCase()]
    if (!mime) continue
    try {
      const resp = await fetch(`${baseUrl}${src}`)
      if (!resp.ok) continue
      const bytes = Buffer.from(await resp.arrayBuffer())
      processed = processed.replaceAll(
        `src="${src}"`,
        `src="data:${mime};base64,${bytes.toString('base64')}"`
      )
    } catch {
      // Leave the root-relative src if fetch fails
    }
  }

  return processed
}

/** Critic-bound JPEGs are downscaled to this width. Claude's vision tokenizer
 * bills roughly by pixel count, not by JPEG quality — a 1280w or 1440w
 * screenshot costs meaningfully more input tokens than the same composition
 * at ~1024w, with zero gain in the critic's ability to judge hierarchy,
 * color, or spec fidelity. The archived PNG (and the full-res JPEG, where one
 * still exists) is never touched — this constant only governs what the
 * critic sees. */
const CRITIC_JPEG_WIDTH = 1024
const CRITIC_JPEG_QUALITY = 70

/**
 * Compute the target pixel size for a critic-bound downscale. Pure and
 * side-effect-free so it's unit-testable without a browser; never upscales
 * a source already narrower than the target.
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @param {number} [targetWidth]
 * @returns {{ width: number, height: number }}
 */
export function computeDownscaleDimensions(
  naturalWidth,
  naturalHeight,
  targetWidth = CRITIC_JPEG_WIDTH
) {
  const scale = Math.min(1, targetWidth / naturalWidth)
  return { width: Math.round(naturalWidth * scale), height: Math.round(naturalHeight * scale) }
}

/**
 * Downscale a full-resolution PNG screenshot buffer to a smaller JPEG for
 * critic consumption, using the already-open page's own <canvas> — no
 * second navigation/render, and no image-processing npm dependency. The
 * resize math mirrors computeDownscaleDimensions (duplicated here because
 * page.evaluate serializes the callback into the page context and cannot
 * close over outer Node functions).
 *
 * @param {import('playwright').Page} page - any open page in the same browser
 * @param {Buffer} pngBuffer - full-resolution source (the archived PNG)
 * @param {{ targetWidth?: number, quality?: number }} [opts]
 * @returns {Promise<Buffer>} downscaled JPEG bytes
 */
async function downscaleForCritic(
  page,
  pngBuffer,
  { targetWidth = CRITIC_JPEG_WIDTH, quality = CRITIC_JPEG_QUALITY } = {}
) {
  const dataUrl = await page.evaluate(
    async ({ base64, targetWidth, quality }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${base64}`
      await img.decode()
      const scale = Math.min(1, targetWidth / img.naturalWidth)
      const width = Math.round(img.naturalWidth * scale)
      const height = Math.round(img.naturalHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      return canvas.toDataURL('image/jpeg', quality / 100)
    },
    { base64: pngBuffer.toString('base64'), targetWidth, quality }
  )
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

/**
 * Long edge, in pixels, for a critic-bound header crop.
 *
 * The full-page screenshot reaches the critic at 1024px for a 1440px-wide
 * page, so every CSS pixel of the header arrives as 0.71 image pixels. That
 * is why an 11px mark and a 44px mark both read as "the lockup is present"
 * (#254). The crop is rendered at deviceScaleFactor 2 and sent at up to
 * 1568px — the largest edge the API keeps without downscaling server-side —
 * which puts the header back above 1:1.
 */
const HEADER_CROP_WIDTH = 1568
const HEADER_CROP_QUALITY = 75

/** Fallback depth of the top band when nothing declares a header height. */
export const DEFAULT_HEADER_CROP_HEIGHT = 160

/**
 * The region of the viewport a header crop should cover, in CSS pixels.
 *
 * Placement comes from the day's `===HEADER===` block. A marginal header is a
 * vertical rail and a top bar is a horizontal band, and cropping the wrong
 * axis would hand the critic a picture of the hero. `none` still gets the top
 * band: the composition grammar's `none` posture removes the nav, not the
 * brand, so the lockup is usually still up there.
 *
 * Pure and side-effect-free so it is testable without a browser.
 *
 * @param {string|null|undefined} placement
 * @param {{ width: number, height: number, declaredHeightPx?: number|null }} viewport
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function headerCropRegion(placement, { width, height, declaredHeightPx } = {}) {
  const w = width ?? 1440
  const h = height ?? 900
  const band = cropBandHeight(h, declaredHeightPx)
  const rail = railWidth(w)
  switch (placement) {
    case 'left-rail':
      return { x: 0, y: 0, width: rail, height: h }
    case 'right-margin':
      return { x: w - rail, y: 0, width: rail, height: h }
    case 'footer-only':
      return { x: 0, y: h - band, width: w, height: band }
    default:
      return { x: 0, y: 0, width: w, height: band }
  }
}

/**
 * Depth of a horizontal header band: the declared height plus room to see
 * what sits under it, so a header that overflows its own declaration is
 * visible in the crop rather than cropped out of it.
 * @param {number} h viewport height
 * @param {number|null|undefined} declaredHeightPx
 * @returns {number}
 */
function cropBandHeight(h, declaredHeightPx) {
  return Math.min(
    h,
    Math.max(DEFAULT_HEADER_CROP_HEIGHT, Math.round((declaredHeightPx || 0) * 1.4) + 48)
  )
}

/**
 * Width of a vertical rail crop for a marginal header.
 * @param {number} w viewport width
 * @returns {number}
 */
function railWidth(w) {
  return Math.min(w, Math.max(360, Math.round(w * 0.34)))
}

/**
 * The header crop when the rendered mark has been found (#503): the same band
 * `headerCropRegion` would take, centred on the mark's box and clamped to the
 * viewport, so a footer-only day's crop shows the mark wherever the engineer
 * put it rather than the bottom of the viewport the declaration implied. A
 * marginal header keeps its rail-shaped crop, anchored to whichever side the
 * mark is on.
 *
 * Pure, like `headerCropRegion`; `mark` is viewport-relative CSS pixels, the
 * shape `getBoundingClientRect` returns.
 *
 * @param {string|null|undefined} placement
 * @param {{ x: number, y: number, width: number, height: number }} mark
 * @param {{ width: number, height: number, declaredHeightPx?: number|null }} viewport
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function markCropRegion(placement, mark, { width, height, declaredHeightPx } = {}) {
  const w = width ?? 1440
  const h = height ?? 900
  const centreX = mark.x + mark.width / 2
  const centreY = mark.y + mark.height / 2
  if (placement === 'left-rail' || placement === 'right-margin') {
    const rail = railWidth(w)
    return { x: centreX < w / 2 ? 0 : w - rail, y: 0, width: rail, height: h }
  }
  const band = cropBandHeight(h, declaredHeightPx)
  const y = Math.min(Math.max(0, Math.round(centreY - band / 2)), h - band)
  return { x: 0, y, width: w, height: band }
}

/**
 * The sentence a critic prompt adds after "a 2x crop of the header region",
 * saying which path `captureHeaderCrop` took. Empty for a capture that
 * predates the anchor, so the swarm fixtures read as they did.
 * @param {'mark'|'placement'|null|undefined} anchor
 * @returns {string}
 */
export function describeHeaderCropAnchor(anchor) {
  if (anchor === 'mark') return ' The crop is centred on the rendered mark.'
  if (anchor === 'placement')
    return ' No mark was found; the crop is taken from the declared placement.'
  return ''
}

/**
 * Runs inside the page; self-contained because Playwright serialises it with
 * `toString()`. The first `[data-brand-mark]` whose box intersects the
 * viewport at scroll position zero, else the first one with a box at all
 * after scrolling it into view, else null. The box comes back
 * viewport-relative, which is the frame a non-fullPage `clip` is taken in.
 * @returns {{ x: number, y: number, width: number, height: number }|null}
 */
function locateBrandMarkForCrop() {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const box = (el) => {
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }
  const marks = [...document.querySelectorAll('[data-brand-mark]')].filter((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  })
  const visible = marks.find((el) => {
    const r = el.getBoundingClientRect()
    return r.right > 0 && r.bottom > 0 && r.left < vw && r.top < vh
  })
  if (visible) return box(visible)
  if (!marks.length) return null
  marks[0].scrollIntoView({ block: 'center', inline: 'nearest' })
  return box(marks[0])
}

/**
 * Render one page at deviceScaleFactor 2 and return a JPEG of the header
 * region, with which path chose the region: `mark` when a rendered
 * `[data-brand-mark]` was found and the crop is centred on it (#503),
 * `placement` when none was and the crop follows the declared placement.
 * Best-effort: the caller treats a null as "no crop this run" rather than a
 * failure, because a missing crop must never be the reason a nightly build
 * stops.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} url page URL (http or file://)
 * @param {{ width: number, height: number, placement?: string|null, declaredHeightPx?: number|null, colorScheme?: 'light'|'dark' }} opts
 * @returns {Promise<{ jpeg: Buffer, anchor: 'mark'|'placement' }|null>}
 */
async function captureHeaderCrop(browser, url, opts) {
  const { width = 1440, height = 900, placement, declaredHeightPx, colorScheme } = opts
  let page = null
  try {
    page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2,
      ...(colorScheme ? { colorScheme } : {}),
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // fonts
    const mark = await page.evaluate(locateBrandMarkForCrop)
    const clip = mark
      ? markCropRegion(placement, mark, { width, height, declaredHeightPx })
      : headerCropRegion(placement, { width, height, declaredHeightPx })
    const png = await page.screenshot({ type: 'png', clip })
    const jpeg = await downscaleForCritic(page, png, {
      targetWidth: HEADER_CROP_WIDTH,
      quality: HEADER_CROP_QUALITY,
    })
    return { jpeg, anchor: mark ? 'mark' : 'placement' }
  } catch {
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

/**
 * The phone the critics are shown. It and `VIEWPORT_RUNGS`' mobile rung in
 * `surface-gate.js` both read `NARROW_VIEWPORT`, so they cannot drift;
 * `tests/scripts/agents/critic-viewports.test.js` still asserts it.
 *
 * Until now every image any critic received was 1440 wide. On 2026-09-04 a
 * design whose whole idea is a question facing its answer lost the split
 * entirely at 360 — the answer panel faced nothing, the concept was absent —
 * and every automatic check passed. Mobile reached a critic only as text.
 */
export const CRITIC_MOBILE_VIEWPORT = NARROW_VIEWPORT

/** Height of one filmstrip fold, in CSS px. Matches the phone viewport's own
 * height, so a fold is what the phone actually shows in one screen. */
const PHONE_FILMSTRIP_FOLD_HEIGHT = CRITIC_MOBILE_VIEWPORT.height
/** Folds shown side by side before the rest are summarized as "not shown". */
const PHONE_FILMSTRIP_MAX_FOLDS = 6
/** Device-pixel gap between adjacent folds in the composed image. */
const PHONE_FILMSTRIP_GUTTER = 16
const PHONE_FILMSTRIP_DSF = 2
/** Matches HEADER_CROP_WIDTH: the largest edge the API keeps without
 * downscaling server-side, so the folds' fine detail survives the trip. */
const PHONE_FILMSTRIP_WIDTH = 1568
const PHONE_FILMSTRIP_QUALITY = 75

/**
 * How a full page height splits into filmstrip folds. Pure and
 * side-effect-free so the arithmetic is testable without a browser.
 *
 * @param {number} pageHeightPx - full page height, CSS px
 * @param {{ foldHeightPx?: number, maxFolds?: number }} [opts]
 * @returns {{ totalFolds: number, shownFolds: number, moreFolds: number }}
 */
export function computePhoneFilmstripFolds(
  pageHeightPx,
  { foldHeightPx = PHONE_FILMSTRIP_FOLD_HEIGHT, maxFolds = PHONE_FILMSTRIP_MAX_FOLDS } = {}
) {
  const totalFolds = Math.max(1, Math.ceil(pageHeightPx / foldHeightPx))
  const shownFolds = Math.min(totalFolds, maxFolds)
  const moreFolds = totalFolds - shownFolds
  return { totalFolds, shownFolds, moreFolds }
}

/**
 * The "N more folds not shown" suffix for the last shown fold, or null when
 * every fold is already shown.
 * @param {number} moreFolds
 * @returns {string|null}
 */
export function phoneFilmstripMoreLabel(moreFolds) {
  if (moreFolds <= 0) return null
  return `${moreFolds} more fold${moreFolds === 1 ? '' : 's'} not shown`
}

/**
 * Crop a full-page screenshot into folds and lay them side by side into one
 * PNG, each fold labeled so the critic knows the labels are ours, not the
 * site's. Runs in the page's own <canvas>, the same trick `downscaleForCritic`
 * uses, so composing costs no image-processing dependency.
 *
 * @param {import('playwright').Page} page
 * @param {Buffer} pngBuffer - full-page screenshot at `dsf`
 * @param {{ totalFolds: number, shownFolds: number, moreFolds: number, foldHeightPx: number, gutterPx: number, dsf: number }} plan
 * @returns {Promise<Buffer>}
 */
async function composePhoneFilmstrip(
  page,
  pngBuffer,
  { totalFolds, shownFolds, moreFolds, foldHeightPx, gutterPx, dsf }
) {
  const dataUrl = await page.evaluate(
    async ({ base64, totalFolds, shownFolds, moreFolds, foldHeightPx, gutterPx, dsf }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${base64}`
      await img.decode()
      const foldWidth = img.naturalWidth
      const foldHeight = foldHeightPx * dsf
      const canvas = document.createElement('canvas')
      canvas.width = shownFolds * foldWidth + (shownFolds - 1) * gutterPx
      canvas.height = foldHeight
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const barHeight = 64
      for (let i = 0; i < shownFolds; i++) {
        const index = i + 1
        const srcY = i * foldHeight
        const srcHeight = Math.min(foldHeight, Math.max(0, img.naturalHeight - srcY))
        const destX = i * (foldWidth + gutterPx)
        if (srcHeight > 0) {
          ctx.drawImage(img, 0, srcY, foldWidth, srcHeight, destX, 0, foldWidth, srcHeight)
        }
        let label = `fold ${index} of ${totalFolds}`
        if (moreFolds > 0 && index === shownFolds) {
          label += ` — ${moreFolds} more fold${moreFolds === 1 ? '' : 's'} not shown`
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
        ctx.fillRect(destX, 0, foldWidth, barHeight)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 32px -apple-system, sans-serif'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, destX + 16, barHeight / 2, foldWidth - 32)
      }
      return canvas.toDataURL('image/png')
    },
    {
      base64: pngBuffer.toString('base64'),
      totalFolds,
      shownFolds,
      moreFolds,
      foldHeightPx,
      gutterPx,
      dsf,
    }
  )
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

/**
 * A whole page at 360 wide, as one filmstrip image: a full-page capture at
 * device scale factor 2, cut into 640-CSS-px folds and laid side by side,
 * each fold labeled, up to six folds shown. Best-effort, like the header
 * crop: a missing image costs a critic one block, never the run.
 *
 * Replaces the single viewport-clipped 360 image every critic used to
 * receive (#466) — that crop showed only the first 640px of the phone, so a
 * hero phrase one fold further down was never seen, and `/about` at 9361px
 * tall was never seen at all.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} url
 * @param {{ colorScheme?: 'light'|'dark' }} [opts]
 * @returns {Promise<Buffer|null>}
 */
export async function capturePhoneFilmstrip(browser, url, { colorScheme } = {}) {
  let page = null
  try {
    page = await browser.newPage({
      viewport: { width: CRITIC_MOBILE_VIEWPORT.width, height: PHONE_FILMSTRIP_FOLD_HEIGHT },
      deviceScaleFactor: PHONE_FILMSTRIP_DSF,
      ...(colorScheme ? { colorScheme } : {}),
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // fonts
    const pageHeightPx = await page.evaluate(() =>
      Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      )
    )
    const { totalFolds, shownFolds, moreFolds } = computePhoneFilmstripFolds(pageHeightPx, {
      foldHeightPx: PHONE_FILMSTRIP_FOLD_HEIGHT,
      maxFolds: PHONE_FILMSTRIP_MAX_FOLDS,
    })
    const png = await page.screenshot({ type: 'png', fullPage: true })
    const composed = await composePhoneFilmstrip(page, png, {
      totalFolds,
      shownFolds,
      moreFolds,
      foldHeightPx: PHONE_FILMSTRIP_FOLD_HEIGHT,
      gutterPx: PHONE_FILMSTRIP_GUTTER,
      dsf: PHONE_FILMSTRIP_DSF,
    })
    return await downscaleForCritic(page, composed, {
      targetWidth: PHONE_FILMSTRIP_WIDTH,
      quality: PHONE_FILMSTRIP_QUALITY,
    })
  } catch {
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

/**
 * Offsets, in ms after `domcontentloaded`, at which the motion strip's frames
 * are taken (#506). The entrance keyframes run 500ms with up to 240ms of
 * stagger, so 0 and 200 catch the hero not yet arrived, 500 catches the h1
 * settled with its last sibling still moving, and 1000 is the still every
 * other capture already takes.
 */
export const MOTION_FRAME_OFFSETS_MS = [0, 200, 500, 1000]
/** Device-pixel gap between adjacent frames in the composed strip. */
const MOTION_STRIP_GUTTER = 16
/** How long after the hero's first painted frame its text tiles are rastered. */
const MOTION_RASTER_SETTLE_MS = 50
/** Matches the filmstrip: the largest edge the API keeps without downscaling. */
const MOTION_STRIP_WIDTH = PHONE_FILMSTRIP_WIDTH
const MOTION_STRIP_QUALITY = PHONE_FILMSTRIP_QUALITY

/**
 * Where each frame lands in the composed motion strip. Pure and
 * side-effect-free so the layout is testable without a browser: N frames of
 * one size laid left to right with a gutter between, each labelled with the
 * offset it was taken at.
 *
 * @param {number[]} offsetsMs
 * @param {{ frameWidth: number, frameHeight: number, gutterPx?: number }} frame
 * @returns {{ width: number, height: number, gutterPx: number, frames: Array<{ index: number, offsetMs: number, label: string, destX: number }> }}
 */
export function computeMotionStripLayout(
  offsetsMs,
  { frameWidth, frameHeight, gutterPx = MOTION_STRIP_GUTTER }
) {
  const frames = offsetsMs.map((offsetMs, index) => ({
    index,
    offsetMs,
    label: `${offsetMs}ms after the hero painted`,
    destX: index * (frameWidth + gutterPx),
  }))
  return {
    width: offsetsMs.length * frameWidth + Math.max(0, offsetsMs.length - 1) * gutterPx,
    height: frameHeight,
    gutterPx,
    frames,
  }
}

/**
 * Lay the captured frames side by side into one PNG, each labelled with its
 * offset, in the page's own <canvas>: the same trick `composePhoneFilmstrip`
 * uses, so the strip costs no image-processing dependency.
 *
 * @param {import('playwright').Page} page
 * @param {Buffer[]} frames - one viewport PNG per offset, in order
 * @param {ReturnType<typeof computeMotionStripLayout>} layout
 * @returns {Promise<Buffer>}
 */
async function composeMotionStrip(page, frames, layout) {
  const dataUrl = await page.evaluate(
    async ({ sources, layout }) => {
      const canvas = document.createElement('canvas')
      canvas.width = layout.width
      canvas.height = layout.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const barHeight = 64
      for (const frame of layout.frames) {
        const img = new Image()
        img.src = `data:image/png;base64,${sources[frame.index]}`
        await img.decode()
        ctx.drawImage(img, frame.destX, 0)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
        ctx.fillRect(frame.destX, 0, img.naturalWidth, barHeight)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 32px -apple-system, sans-serif'
        ctx.textBaseline = 'middle'
        ctx.fillText(frame.label, frame.destX + 16, barHeight / 2, img.naturalWidth - 32)
      }
      return canvas.toDataURL('image/png')
    },
    { sources: frames.map((f) => f.toString('base64')), layout }
  )
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

/**
 * Four frames of a page's first second, as one strip (#506).
 *
 * Every other capture waits for `networkidle` and then a flat second, which
 * is after any entrance has finished, so no critic has ever seen the page
 * move. This one navigates with `domcontentloaded` and screenshots at the
 * offsets in `MOTION_FRAME_OFFSETS_MS`, then composes them at the
 * filmstrip's width. Each screenshot takes real time, so the offsets are the
 * earliest a frame is asked for, not a guarantee; the labels carry the
 * nominal offset.
 *
 * Three things anchor the clock so the frames show motion and nothing else.
 * The page is visited once first, to `networkidle`, so the stylesheet and
 * the webfonts are in this context's cache and a face swapping in between
 * frames cannot read as an entrance. Then, after the real navigation, the
 * clock waits for the page's one `h1` to be in the DOM: on the dev server
 * the hero section mounts some tens of milliseconds after
 * `domcontentloaded`, and its entrance starts when it mounts, so a frame
 * taken at the document's first paint showed the shell with no hero on it
 * at all. Then `document.fonts.ready`, two painted frames, and a short
 * raster settle: the frame right after the hero mounts still had the nav
 * and footer text unrastered, and a nav that "appears" between frames one
 * and two would read to the critic as a cascade. The first frame is
 * therefore a complete paint of the hero some 50ms into its entrance, which
 * the labels round to zero; they say "after the hero painted" for that reason.
 *
 * The frames themselves come from CDP `Page.captureScreenshot`, not from
 * `page.screenshot`. Playwright's screenshot injects a stylesheet, captures,
 * and removes it again, and that repaint left the next capture with the
 * text tiles unrastered: a field with no words on it, or words with no
 * field. A raw surface capture leaves the page alone between frames.
 *
 * Takes an open page rather than a browser so a caller can emulate reduced
 * motion on it first (`page.emulateMedia({ reducedMotion: 'reduce' })`) and
 * see every frame arrive settled.
 *
 * @param {import('playwright').Page} page - viewport already set
 * @param {string} url
 * @param {{ offsetsMs?: number[] }} [opts]
 * @returns {Promise<Buffer>} the strip, as a critic-bound JPEG
 */
export async function captureMotionFrames(page, url, { offsetsMs = MOTION_FRAME_OFFSETS_MS } = {}) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  // Every route renders one h1 (the surface gate fails a route without
  // one); a page that somehow has none is captured from the document's own
  // first paint instead of failing the strip.
  await page.waitForSelector('h1', { state: 'attached', timeout: 5000 }).catch(() => null)
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  )
  await page.waitForTimeout(MOTION_RASTER_SETTLE_MS)
  const cdp = await page.context().newCDPSession(page)
  const t0 = Date.now()
  const frames = []
  try {
    for (const offset of offsetsMs) {
      const wait = t0 + offset - Date.now()
      if (wait > 0) await page.waitForTimeout(wait)
      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
      })
      frames.push(Buffer.from(data, 'base64'))
    }
  } finally {
    await cdp.detach().catch(() => {})
  }
  const viewport = page.viewportSize() ?? { width: 1440, height: 900 }
  const layout = computeMotionStripLayout(offsetsMs, {
    frameWidth: viewport.width,
    frameHeight: viewport.height,
  })
  const composed = await composeMotionStrip(page, frames, layout)
  return await downscaleForCritic(page, composed, {
    targetWidth: MOTION_STRIP_WIDTH,
    quality: MOTION_STRIP_QUALITY,
  })
}

/**
 * `captureMotionFrames` on a fresh 1440x900 page, best-effort like the
 * header crop: a missing strip costs the critic one image, never the run.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} url
 * @returns {Promise<Buffer|null>}
 */
async function captureMotionStrip(browser, url) {
  let page = null
  try {
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    return await captureMotionFrames(page, url)
  } catch {
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

/**
 * `capturePhoneFilmstrip` for a route on the served build, managing its own
 * preview server and browser — the same shape as `captureRouteScreenshot`,
 * used the same way in `design-agents.js`'s screenshot-critic step to add
 * `/about` and a case study to what only the home page used to get (#466).
 *
 * @param {string} route - e.g. "/about"
 * @param {{ port?: number, colorScheme?: 'light'|'dark' }} [opts]
 * @returns {Promise<Buffer|null>}
 */
export async function captureRoutePhoneFilmstrip(route, { port, colorScheme } = {}) {
  const { chromium } = await import('playwright')
  return await withPreviewServer(
    async (baseUrl) => {
      let browser = null
      try {
        browser = await chromium.launch({ headless: true })
        return await capturePhoneFilmstrip(browser, `${baseUrl}${route}`, { colorScheme })
      } finally {
        if (browser) await browser.close()
      }
    },
    { port }
  )
}

/**
 * Read the rendered silhouette out of a served page at 1440.
 *
 * The critic screenshot and the header crop are both taken at 1440; the
 * fingerprint gets its own page rather than borrowing either, because it has to
 * be the same viewport every night for the numbers to mean anything, and both
 * of those widths have moved before.
 *
 * Best-effort, like the header crop: a missing fingerprint costs the uniqueness
 * index one metric, never the run.
 *
 * @param {import('playwright').Browser} browser
 * @param {string} url
 * @returns {Promise<object|null>} the fingerprint.json payload
 */
async function captureFingerprint(browser, url) {
  let page = null
  try {
    page = await browser.newPage({ viewport: { ...FINGERPRINT_VIEWPORT } })
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // fonts, so a headline's box is its real box
    return await page.evaluate(collectGeometry)
  } catch {
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

/**
 * Poll a URL until it returns HTTP 200.
 * @param {string} url
 * @param {number} timeoutMs
 * @param {number} intervalMs
 * @returns {Promise<void>}
 */
/**
 * Start `vite preview`, hand its base URL to `fn`, and always shut it down.
 *
 * There used to be three copies of this, deciding "ready" two different ways.
 * `captureSnapshot` polled the server over HTTP; `captureScreenshot` and
 * `captureRouteScreenshot` scraped stdout for the string `Local:` with a 15s
 * timeout. On 2026-08-30 that difference cost the run its entire visual
 * review — same machine, same seconds:
 *
 *   snapshot     -> 9 pages saved
 *   screenshot   -> Failed (non-blocking): Preview server timeout
 *   og capture   -> Failed (non-blocking): Preview server timeout
 *
 * Vite does not print that banner when stdout is not a TTY, so in CI the
 * string never arrives and the timer always wins. The design shipped with no
 * screenshot critic, no OG card and no responsive metrics, and the run
 * reported success because all three failures are non-blocking.
 *
 * Two other things this fixes by consolidating:
 *
 * - It spawned `npx`, and `child.kill()` kills the npx wrapper, not the vite
 *   process underneath. A run that captures snapshot + screenshot + OG could
 *   leave preview servers behind. Spawning the vite binary directly in its own
 *   process group and killing the group takes the whole tree down.
 * - The port was `14000 + random(1000)` in three places, so two captures in
 *   the same run could collide. One helper, one place to fix that.
 *
 * @param {(baseUrl: string, port: number) => Promise<T>} fn
 * @param {{ port?: number, timeoutMs?: number }} [options] `port` reuses a
 *   server the caller already started, in which case nothing is spawned here.
 * @returns {Promise<T>}
 * @template T
 */
export async function withPreviewServer(
  fn,
  { port, timeoutMs = STEP_BUDGETS.previewReadyMs } = {}
) {
  if (port) return await fn(`http://localhost:${port}`, port)

  const serverPort = 14000 + Math.floor(Math.random() * 1000)
  const baseUrl = `http://localhost:${serverPort}`
  // The vite binary directly, not through npx: killing npx leaves vite running.
  const bin = path.join(ROOT, 'node_modules', '.bin', 'vite')
  const server = spawn(bin, ['preview', '--port', String(serverPort)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  })

  let stderr = ''
  server.stderr?.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  // A server that dies immediately (port in use, missing dist/) should say so
  // rather than waiting out the readiness timeout.
  let exited = null
  server.on('exit', (code) => {
    exited = code
  })

  try {
    // Ask the server whether it is up, rather than reading its mind from stdout.
    const deadline = Date.now() + timeoutMs
    for (;;) {
      if (exited !== null) {
        throw new Error(
          `vite preview exited with code ${exited} before serving${stderr ? `: ${stderr.trim().slice(0, 300)}` : ''}`
        )
      }
      try {
        const resp = await fetch(`${baseUrl}/`)
        if (resp.ok) break
      } catch {
        // not listening yet
      }
      if (Date.now() >= deadline) {
        throw new Error(
          `vite preview did not answer on ${baseUrl} within ${timeoutMs}ms${stderr ? `: ${stderr.trim().slice(0, 300)}` : ''}`
        )
      }
      await new Promise((r) => setTimeout(r, 250))
    }

    return await fn(baseUrl, serverPort)
  } finally {
    // Kill the process group, not just the direct child.
    try {
      if (server.pid && exited === null) process.kill(-server.pid, 'SIGTERM')
    } catch {
      try {
        server.kill('SIGTERM')
      } catch {
        /* already gone */
      }
    }
  }
}

/**
 * Capture a static HTML snapshot of every portfolio route.
 *
 * Starts vite preview, crawls routes, processes HTML, and writes files
 * to `archive/<date>/site/`.
 *
 * @param {string} date - archive date string, e.g. "2026-03-16"
 * @param {string} [buildId]
 * @param {{ root?: string }} [options] - where to write. Defaults to the repo
 *   (ROOT); tests pass a temp dir so the site snapshot never lands in the
 *   working tree (#314).
 * @returns {Promise<void>}
 */
export async function captureSnapshot(date, buildId, { root = ROOT } = {}) {
  return await withPreviewServer(async (baseUrl) => {
    console.log('  capturing snapshot...')

    // Read project slugs from the source file
    const projectsSrc = await readFile(path.join(ROOT, 'app/content/projects.ts'), 'utf8')
    const slugs = [...projectsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])

    const routes = [
      { url: '/', file: 'index.html' },
      { url: '/about', file: 'about.html' },
      ...slugs.map((s) => ({ url: `/work/${s}`, file: `work/${s}.html` })),
    ]

    // Crawl each route
    for (const route of routes) {
      try {
        const resp = await fetch(`${baseUrl}${route.url}`)
        if (!resp.ok) {
          console.warn(`  snapshot: skipping ${route.url} (HTTP ${resp.status})`)
          route.html = null
          continue
        }
        const html = await resp.text()
        route.html = await processHtml(html, baseUrl)
      } catch (err) {
        console.warn(`  snapshot: skipping ${route.url} (${err.message})`)
        route.html = null
      }
    }

    // Save files — to build-specific directory if buildId provided, otherwise top-level
    const baseDir = buildId
      ? path.join(root, 'archive', date, `build-${buildId}`)
      : path.join(root, 'archive', date)
    const siteDir = path.join(baseDir, 'site')
    await mkdir(siteDir, { recursive: true })
    await mkdir(path.join(siteDir, 'work'), { recursive: true })

    // Also save to top-level site/ for backwards compatibility
    if (buildId) {
      const latestSiteDir = path.join(root, 'archive', date, 'site')
      await mkdir(latestSiteDir, { recursive: true })
      await mkdir(path.join(latestSiteDir, 'work'), { recursive: true })
      for (const route of routes) {
        if (route.html === null) continue
        await writeFile(path.join(latestSiteDir, route.file), route.html, 'utf8')
      }
    }

    let saved = 0
    for (const route of routes) {
      if (route.html === null) continue
      const filePath = path.join(siteDir, route.file)
      await writeFile(filePath, route.html, 'utf8')
      console.log(`  snapshot: ${route.file}`)
      saved++
    }

    console.log(`  snapshot: ${saved} pages saved`)
  })
}

/**
 * Capture a PNG screenshot of the rendered homepage.
 * Spins up a Vite preview server and uses Playwright to render and screenshot.
 *
 * Returns both encodings from one render: PNG for archive/public artifacts,
 * JPEG (downscaled to ~1024w, q70) for critic prompts. Gradient-heavy
 * designs produce ~900KB PNGs; two of those base64'd made a 1.6MB critic
 * prompt that the model answered with 0 bytes (2026-07-10 run 2). The JPEG
 * is downscaled AND re-encoded, typically 10-20x smaller than the PNG and
 * cheaper in image tokens than a full-res JPEG at the same quality (see
 * CRITIC_JPEG_WIDTH above).
 *
 * @param {number} [port] - Optional port if server is already running
 * @param {{ headerCrop?: { placement?: string|null, heightPx?: number|null }, motion?: { entrance?: string|null, ground?: string|null }|null }} [opts]
 *   the day's HEADER declaration, which decides where the header crop is
 *   taken, and its MOTION declaration (#506), which decides whether the
 *   frame strip is taken at all
 * @returns {Promise<{png: Buffer, jpeg: Buffer, darkPng: Buffer|null, darkJpeg: Buffer|null, headerJpeg: Buffer|null, headerCropAnchor: 'mark'|'placement'|null, mobileJpeg: Buffer|null, motionStripJpeg: Buffer|null, fingerprint: object|null}>}
 *   `darkPng` and `darkJpeg` are null when the dark scheme renders
 *   byte-identical to the light one, which is every design that defines no
 *   `_light` tokens
 */
export async function captureScreenshot(port, { headerCrop, motion } = {}) {
  const { chromium } = await import('playwright')

  return await withPreviewServer(
    async (baseUrl) => {
      let browser = null
      try {
        browser = await chromium.launch({ headless: true })
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
        await page.goto(`${baseUrl}/`, {
          waitUntil: 'networkidle',
        })
        await page.waitForTimeout(1000) // wait for fonts
        const png = await page.screenshot({ type: 'png', fullPage: false })
        const jpeg = await downscaleForCritic(page, png)

        // Second capture with the OPPOSITE color scheme. The theme init script
        // follows prefers-color-scheme, so a headless capture only ever showed
        // the light variant — on days where the AD's canonical field is dark
        // (2026-07-10 run 2: "teal glowing out of near-black"), the critic was
        // judging a mode nobody art-directed. colorScheme must be set at page
        // creation, before the init script reads matchMedia.
        const darkPage = await browser.newPage({
          viewport: { width: 1440, height: 900 },
          colorScheme: 'dark',
        })
        await darkPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
        await darkPage.waitForTimeout(1000)
        const darkShot = await darkPage.screenshot({ type: 'png', fullPage: false })
        // A design whose semantic tokens carry no `_light` variant renders the
        // same in both schemes: 17 of the 18 archived builds that took this
        // capture wrote a screenshot-dark.png byte-identical to screenshot.png.
        // The scheme does switch (the one build that defined `_light` differs),
        // so a match means the design is single-mode, not that the capture
        // failed. Return nothing for the dark side then: the critic is not
        // sent the same picture twice and the archive does not store it twice.
        const darkDiffers = !darkShot.equals(png)
        const darkPng = darkDiffers ? darkShot : null
        const darkJpeg = darkDiffers ? await downscaleForCritic(darkPage, darkShot) : null

        // Header crop, rendered separately at 2x and 1440 wide so it lines up
        // with the mockup's crop. Never blocking — a missing crop costs the
        // critics one image, not the run.
        const header = await captureHeaderCrop(browser, `${baseUrl}/`, {
          width: 1440,
          height: 900,
          placement: headerCrop?.placement ?? null,
          declaredHeightPx: headerCrop?.heightPx ?? null,
        })
        const headerJpeg = header?.jpeg ?? null
        const headerCropAnchor = header?.anchor ?? null

        // The whole page on a phone, as a filmstrip. Both critics now receive
        // it beside the 1440 render, because the desktop-only diet is how a
        // design that has no idea left at 360 shipped with every check green,
        // and a single 640px crop is how a hero one fold further down went
        // unseen (#466).
        const mobileJpeg = await capturePhoneFilmstrip(browser, `${baseUrl}/`)

        // The first second, as four frames (#506). Only on a night that
        // declared an entrance or a drifting ground: a still page has no
        // strip to judge, and the image slot goes back to the discretionary
        // captures.
        const motionStripJpeg = hasFirstPaintMotion(motion)
          ? await captureMotionStrip(browser, `${baseUrl}/`)
          : null

        // The rendered-geometry fingerprint (#255). Taken from the same served
        // build the critic is about to judge, so the silhouette recorded is the
        // silhouette that shipped.
        const fingerprint = await captureFingerprint(browser, `${baseUrl}/`)

        return {
          png,
          jpeg,
          darkPng,
          darkJpeg,
          headerJpeg,
          headerCropAnchor,
          mobileJpeg,
          motionStripJpeg,
          fingerprint,
        }
      } finally {
        // Close in finally so a throw from page.goto / screenshot (dead preview
        // server, networkidle timeout) can't orphan the headless Chromium — the
        // critic gate calls this up to 3× per run, so leaks accumulate and OOM.
        if (browser) await browser.close()
      }
    },
    { port }
  )
}

/**
 * Screenshot a local self-contained HTML file (the Mockup Designer's
 * mockup.html) without any server. External font links still load over
 * the network.
 *
 * @param {string} filePath - absolute path to the HTML file
 * @param {{ width?: number, height?: number, headerCrop?: { placement?: string|null, heightPx?: number|null } }} [opts]
 * @returns {Promise<{png: Buffer, jpeg: Buffer, headerJpeg: Buffer|null, headerCropAnchor: 'mark'|'placement'|null, mobileJpeg: Buffer|null, measured: {canvas_utilization: number, color_coverage: number, hero_px: number}}>}
 *   image buffers — PNG for archives, JPEG (downscaled, q70) for critic
 *   prompts (see captureScreenshot), plus a 2x crop of the declared header
 *   region, the same mockup rendered at the phone rung, and the
 *   design-fidelity numbers (#487) measured on this same page at the
 *   viewport size above — the achieved-side counterpart the built page
 *   already gets from `scoreResponsive`'s desktop rung, so the Mockup
 *   Critic stops estimating them by eye.
 */
export async function captureHtmlFileScreenshot(
  filePath,
  { width = 1440, height = 900, headerCrop } = {}
) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // fonts
    const png = await page.screenshot({ type: 'png', fullPage: false })
    const jpeg = await downscaleForCritic(page, png)
    // Same page, same load — no second browser or navigation just to measure
    // what is already rendered.
    const measured = await page.evaluate(measureDesignFidelity)
    const header = await captureHeaderCrop(browser, `file://${filePath}`, {
      width,
      height,
      placement: headerCrop?.placement ?? null,
      declaredHeightPx: headerCrop?.heightPx ?? null,
    })
    const headerJpeg = header?.jpeg ?? null
    const headerCropAnchor = header?.anchor ?? null
    // The mockup on a phone, as a filmstrip, for the same reason the shipped
    // page gets one: the mockup critic is the blocking gate between design
    // and engineering, and until now it had never seen anything past 640px
    // of the phone (#466).
    const mobileJpeg = await capturePhoneFilmstrip(browser, `file://${filePath}`)
    return { png, jpeg, headerJpeg, headerCropAnchor, mobileJpeg, measured }
  } finally {
    await browser.close()
  }
}

/**
 * Capture a PNG screenshot of an arbitrary route on the built site.
 *
 * Spins up a Vite preview server (unless a port is supplied), renders the
 * route at the given viewport, and screenshots it. Used to capture the
 * runtime-generated /og card at the canonical 1200x630 OG dimensions.
 *
 * @param {string} route - route path, e.g. "/og"
 * @param {{ port?: number, width?: number, height?: number }} [opts]
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function captureRouteScreenshot(route, { port, width = 1200, height = 630 } = {}) {
  const { chromium } = await import('playwright')

  return await withPreviewServer(
    async (baseUrl) => {
      let browser = null
      try {
        browser = await chromium.launch({ headless: true })
        const page = await browser.newPage({ viewport: { width, height } })
        const response = await page.goto(`${baseUrl}${route}`, {
          waitUntil: 'networkidle',
        })
        // Guard against capturing a 404 page. /og is unlinked, so it is never
        // prerendered or build-validated — if the engineer omitted og.tsx, the
        // route serves the notFound component. Throwing here lets the caller's
        // best-effort catch skip writing a broken share card.
        if (response && !response.ok()) {
          throw new Error(`route ${route} returned HTTP ${response.status()}`)
        }
        await page.waitForTimeout(1000) // wait for fonts
        return await page.screenshot({ type: 'png', fullPage: false })
      } finally {
        if (browser) await browser.close()
      }
    },
    { port }
  )
}
