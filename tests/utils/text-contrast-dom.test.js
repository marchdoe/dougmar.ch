/**
 * The page half of the text-contrast gate (#566), against real Chromium.
 *
 * The compositing arithmetic is proved in text-contrast.test.js with numbers
 * fed in by hand. This proves the other half: that the walk up the ancestor
 * chain reads what a browser actually paints. Each case is a page shape that
 * shipped, or one the walk could get wrong.
 */
import { chromium } from '@playwright/test'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { contrastRatio } from '../../scripts/utils/contrast.js'
import { faultsForOwner } from '../../scripts/utils/surface-gate.js'
import { measureCandidate, textContrastFindings } from '../../scripts/utils/text-contrast.js'
import { collectTextContrast, measureTextContrast } from '../../scripts/utils/text-contrast-page.js'

const rgb = (r, g = r, b = r) => ({ r, g, b })

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
})

async function collect(html, viewport = WIDE_VIEWPORT) {
  const page = await browser.newPage({ viewport })
  try {
    await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
    return await collectTextContrast(page)
  } finally {
    await page.close()
  }
}

const only = (result) => {
  expect(result.candidates).toHaveLength(1)
  return result.candidates[0]
}

describe('the colours a browser paints', () => {
  it('measures text on an opaque ground: #777 on white is 4.478:1', async () => {
    const c = only(
      await collect('<p style="background:#fff;color:#777;font-size:14px">Small label</p>')
    )
    expect(c.unresolved).toBeNull()
    const { ratio } = measureCandidate(c)
    expect(ratio).toBeCloseTo(contrastRatio(rgb(0x77), rgb(255)), 3)
    expect(ratio).toBeLessThan(4.5)
  })

  it('takes the canvas as white when nothing paints a ground', async () => {
    const c = only(await collect('<p style="color:#000;font-size:14px">Plain</p>'))
    expect(measureCandidate(c).ratio).toBeCloseTo(21, 3)
  })

  it('composites a translucent ground over the opaque one behind it', async () => {
    // white at 50% over black is #808080; white text on that is 3.95:1
    const c = only(
      await collect(
        `<div style="background:#000"><p style="background:rgba(255,255,255,.5);color:#fff;font-size:14px">Tinted</p></div>`
      )
    )
    const { ratio, bg } = measureCandidate(c)
    expect(Math.round(bg.r)).toBe(128)
    expect(ratio).toBeCloseTo(contrastRatio(rgb(255), rgb(127.5)), 2)
  })

  it('composites alpha in the text colour over its ground', async () => {
    const c = only(
      await collect('<p style="background:#fff;color:rgba(0,0,0,.5);font-size:14px">Ghost</p>')
    )
    const { fg } = measureCandidate(c)
    expect(Math.round(fg.r)).toBe(128)
  })

  it('applies opacity set on an ancestor to the text and its ground together', async () => {
    // Black on white at group opacity .5 is #808080 on white.
    const c = only(
      await collect(
        '<div style="opacity:.5"><p style="background:#fff;color:#000;font-size:14px">Dimmed</p></div>'
      )
    )
    const { fg, bg, ratio } = measureCandidate(c)
    expect(Math.round(fg.r)).toBe(128)
    expect(Math.round(bg.r)).toBe(255)
    expect(ratio).toBeCloseTo(contrastRatio(rgb(127.5), rgb(255)), 2)
  })

  it('lets what is behind an opacity group show through it', async () => {
    // A #000 page ground, an opaque white card at opacity .5: the card reads
    // as #808080, and black text on it as black on #808080.
    const c = only(
      await collect(
        '<div style="background:#000"><div style="opacity:.5;background:#fff"><p style="color:#000;font-size:14px">Card</p></div></div>'
      )
    )
    const { fg, bg } = measureCandidate(c)
    expect(Math.round(bg.r)).toBe(128)
    expect(Math.round(fg.r)).toBe(0)
  })

  it('resolves color-mix and oklch, which computed style does not return as rgb()', async () => {
    const mixed = only(
      await collect(
        '<p style="background:#fff;color:color-mix(in srgb, #000 50%, transparent);font-size:14px">Mixed</p>'
      )
    )
    expect(Math.round(measureCandidate(mixed).fg.r)).toBe(128)
    const oklch = only(
      await collect('<p style="background:#fff;color:oklch(0.5 0 0);font-size:14px">Perceptual</p>')
    )
    const { fg } = measureCandidate(oklch)
    expect(fg.r).toBeGreaterThan(94)
    expect(fg.r).toBeLessThan(104)
    expect(Math.round(fg.g)).toBe(Math.round(fg.r))
  })
})

describe('a ground that is not a flat colour', () => {
  it('reports a background-image ancestor and names it, with no ratio', async () => {
    const c = only(
      await collect(
        `<section class="ruled" style="background:#fff repeating-linear-gradient(0deg, transparent 0 9px, #ccc 9px 10px)"><p style="color:#000;font-size:14px">Ruled</p></section>`
      )
    )
    expect(c.unresolved).toContain('section.ruled')
    expect(c.unresolved).toContain('background-image')
    expect(measureCandidate(c)).toBeNull()
  })

  it('finds the image on body, the ancestor a whole page can sit on', async () => {
    const page = await browser.newPage({ viewport: WIDE_VIEWPORT })
    try {
      await page.setContent(
        `<!doctype html><body style="margin:0;background:#fff linear-gradient(#eee,#ddd)"><p style="color:#000;font-size:14px">Page</p></body>`
      )
      const result = await collectTextContrast(page)
      expect(only(result).unresolved).toContain('body')
    } finally {
      await page.close()
    }
  })

  it('ignores an image hidden behind an opaque, full-opacity ground nearer the text', async () => {
    const c = only(
      await collect(
        `<div style="background-image:linear-gradient(red,blue)"><p style="background:#fff;color:#000;font-size:14px">Carded</p></div>`
      )
    )
    expect(c.unresolved).toBeNull()
    expect(measureCandidate(c).ratio).toBeCloseTo(21, 3)
  })

  it('does not ignore it when a group between is translucent', async () => {
    const c = only(
      await collect(
        `<div style="background-image:linear-gradient(red,blue)"><div style="opacity:.5"><p style="background:#fff;color:#000;font-size:14px">Faded</p></div></div>`
      )
    )
    expect(c.unresolved).toContain('background-image')
  })

  it('reports a painted, positioned pseudo-element over the text', async () => {
    const c = only(
      await collect(
        `<style>.veil{position:relative;background:#fff}.veil::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.4)}</style>
           <div class="veil"><p style="color:#000;font-size:14px">Veiled</p></div>`
      )
    )
    expect(c.unresolved).toContain('div.veil::after')
  })

  it('lets a hairline pseudo-element rule pass: it cannot hide text', async () => {
    const c = only(
      await collect(
        `<style>.rule{position:relative;background:#fff}.rule::after{content:"";position:absolute;left:0;bottom:0;width:100%;height:2px;background:#000}</style>
           <div class="rule"><p style="color:#000;font-size:14px">Ruled under</p></div>`
      )
    )
    expect(c.unresolved).toBeNull()
  })

  it('reports a positioned sibling that paints a texture over the text, as 09-18 shipped', async () => {
    // The ruled lines were an absolutely positioned div beside the copy.
    const c = only(
      await collect(
        `<section style="position:relative;background:#fff">
             <div class="rules" style="position:absolute;inset:0;background-image:repeating-linear-gradient(#ccc 0 1px, transparent 1px 32px)"></div>
             <p style="position:relative;color:#000;font-size:14px">Kicker</p>
           </section>`
      )
    )
    expect(c.unresolved).toContain('div.rules')
    expect(c.unresolved).toContain('positioned background-image')
    expect(measureCandidate(c)).toBeNull()
  })

  it('reports a positioned image or a colour veil under the text, whatever its stacking', async () => {
    const veil = only(
      await collect(
        `<div style="position:relative;background:#fff"><div class="veil" style="position:absolute;inset:0;background:rgba(0,0,0,.4)"></div><p style="color:#000;font-size:14px">Veiled</p></div>`
      )
    )
    expect(veil.unresolved).toContain('div.veil (positioned background)')
    const img = only(
      await collect(
        `<div style="position:relative"><img alt="" width="400" height="200" style="position:absolute;left:0;top:0"><p style="color:#000;font-size:14px">Over a photo</p></div>`
      )
    )
    expect(img.unresolved).toContain('img (positioned img)')
  })

  it('leaves a positioned painter alone when it does not reach the text', async () => {
    const c = only(
      await collect(
        `<div style="position:relative;background:#fff;height:200px">
             <div style="position:absolute;right:0;bottom:0;width:40px;height:40px;background-image:linear-gradient(red,blue)"></div>
             <p style="margin:0;color:#000;font-size:14px">Top left</p>
           </div>`
      )
    )
    expect(c.unresolved).toBeNull()
  })

  it('does not count an ancestor’s own positioning or a highlight inside the text', async () => {
    const result = await collect(
      `<div style="position:absolute;top:0;left:0;background:#fff"><p style="color:#000;font-size:14px">Placed <mark style="position:absolute">Marked</mark></p></div>`
    )
    expect(result.candidates.find((x) => x.text.startsWith('Placed'))?.unresolved).toBeNull()
  })

  it('reports a blend mode between the text and its ground', async () => {
    const c = only(
      await collect(
        '<div style="background:#fff;mix-blend-mode:multiply"><p style="color:#000;font-size:14px">Blended</p></div>'
      )
    )
    expect(c.unresolved).toContain('mix-blend-mode')
  })
})

describe('which text is measured', () => {
  it('skips large text: 24px, and bold from 18.66px', async () => {
    const result = await collect(
      `<p class="a" style="color:#eee;font-size:24px">Large</p>
         <p class="b" style="color:#eee;font-size:19px;font-weight:700">Large bold</p>
         <p class="c" style="color:#eee;font-size:23.9px">Almost large</p>
         <p class="d" style="color:#eee;font-size:18px;font-weight:700">Small bold</p>
         <p class="e" style="color:#eee;font-size:19px">Small at 19px regular</p>`
    )
    expect(result.candidates.map((c) => c.text)).toEqual([
      'Almost large',
      'Small bold',
      'Small at 19px regular',
    ])
    expect(result.large).toBe(2)
  })

  it('skips text a reader cannot see', async () => {
    const result = await collect(
      `<p style="display:none;color:#eee">none</p>
         <p style="visibility:hidden;color:#eee">hidden</p>
         <p style="opacity:0;color:#eee">transparent</p>
         <div style="opacity:0"><p style="color:#eee">inside a transparent group</p></div>
         <span style="position:absolute;left:-9999px;color:#eee">parked off screen</span>
         <span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);color:#eee">sr only</span>
         <p style="color:rgba(0,0,0,0)">no ink</p>
         <p style="color:#eee">seen</p>`
    )
    expect(result.candidates.map((c) => c.text)).toEqual(['seen'])
  })

  it('skips text with no letters or digits, and text inside inline svg', async () => {
    const result = await collect(
      `<p style="color:#eee">&rarr;</p><svg width="100" height="20"><text y="14" fill="#eee">chart label</text></svg>`
    )
    expect(result.candidates).toEqual([])
  })

  it('counts one candidate for the same element chain and colours, however often it repeats', async () => {
    const item = '<li class="tag" style="color:#999;background:#fff;font-size:14px">Tag</li>'
    const c = only(await collect(`<ul>${item}${item}${item}</ul>`))
    expect(c.count).toBe(3)
  })

  it('reads the mobile rung the same way, including a media query that changes the ground', async () => {
    const html = `<style>p{background:#fff;color:#000;font-size:14px}@media (max-width:${NARROW_VIEWPORT.width}px){p{background:#000}}</style><p>Label</p>`
    expect(measureCandidate(only(await collect(html, WIDE_VIEWPORT))).ratio).toBeCloseTo(21, 3)
    expect(measureCandidate(only(await collect(html, NARROW_VIEWPORT))).ratio).toBeCloseTo(1, 3)
  })
})

describe('scroll-revealed text', () => {
  const reveal = `<style>
      @keyframes rise { from { opacity: 0 } to { opacity: 1 } }
      .rise { animation: rise both linear; animation-timeline: view(); animation-range: entry 0% entry 40%; }
    </style>
    <div style="height:2600px"></div>
    <p class="rise" style="color:#bbb;font-size:14px">Below the fold</p>`

  it('is at opacity 0 for the plain walk, which is why the gate resizes the viewport', async () => {
    const page = await browser.newPage({ viewport: WIDE_VIEWPORT })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${reveal}</body></html>`)
      // The scroll timeline attaches on the first frames.
      await page.evaluate(
        () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
      )
      expect((await collectTextContrast(page)).candidates).toEqual([])
    } finally {
      await page.close()
    }
  })

  it('is measured once the viewport is as tall as the document, and the viewport comes back', async () => {
    const page = await browser.newPage({ viewport: WIDE_VIEWPORT })
    try {
      await page.setContent(`<!doctype html><html><body style="margin:0">${reveal}</body></html>`)
      const result = await measureTextContrast(page)
      expect(result.candidates.map((c) => c.text)).toEqual(['Below the fold'])
      expect(measureCandidate(result.candidates[0]).ratio).toBeLessThan(3)
      expect(page.viewportSize()).toEqual({
        width: WIDE_VIEWPORT.width,
        height: WIDE_VIEWPORT.height,
      })
    } finally {
      await page.close()
    }
  })
})

describe('who owns a finding', () => {
  const lowContrast = 'background:#fff;color:#ccc;font-size:14px'

  it('routes text inside the home callout to the owner, not the engineer', async () => {
    const result = await collect(
      `<aside data-site-callout><a href="/archive" style="${lowContrast}">Archive</a></aside>`
    )
    expect(only(result).part).toBe('SiteCallout')
    const findings = textContrastFindings({ textContrast: result }, 'react-engineer')
    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({ kind: 'contrast', severity: 'error', owner: 'human' })
    expect(findings[0].detail).toContain('SiteCallout')
    expect(faultsForOwner(findings, 'react-engineer')).toEqual([])
    expect(faultsForOwner(findings, 'human')).toHaveLength(1)
  })

  it('routes the wordmark and role line of a BrandLockup by way of the mark, its marker', async () => {
    const result = await collect(
      `<span><svg data-brand-mark="" width="20" height="20"></svg><span style="${lowContrast}">Doug March</span></span>`
    )
    expect(only(result).part).toBe('BrandLockup')
  })

  it('routes the white paper, the archive link and material grounds the same way', async () => {
    for (const [attr, name] of [
      ['data-white-paper', 'WhitePaper'],
      ['data-archive-link', 'the archive link'],
      ['data-ground-material', 'Material'],
    ]) {
      const result = await collect(`<div ${attr}><p style="${lowContrast}">Text</p></div>`)
      expect(only(result).part).toBe(name)
    }
  })

  it('keeps text outside every orchestrator part with the owner of the route', async () => {
    const result = await collect(`<p style="${lowContrast}">Kicker</p>`)
    const [finding] = textContrastFindings({ textContrast: result }, 'react-engineer')
    expect(finding.owner).toBe('react-engineer')
    expect(finding.severity).toBe('error')
    expect(faultsForOwner([finding], 'react-engineer')).toHaveLength(1)
  })
})
