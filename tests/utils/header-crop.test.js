import { describe, it, expect } from 'vitest'
import {
  DEFAULT_HEADER_CROP_HEIGHT,
  describeHeaderCropAnchor,
  headerCropRegion,
  markCropRegion,
} from '../../scripts/utils/snapshot.js'
import { buildMockupCriticBlocks } from '../../scripts/agents/mockup-critic.js'
import {
  MAX_SCREENSHOT_CRITIC_IMAGES,
  buildScreenshotCriticBlocks,
} from '../../scripts/agents/screenshot-critic.js'

const VIEWPORT = { width: 1440, height: 900 }
const buf = (n) => Buffer.from(n)

describe('headerCropRegion', () => {
  it('takes a top band for a top bar', () => {
    expect(headerCropRegion('top-bar', { ...VIEWPORT, declaredHeightPx: 96 })).toEqual({
      x: 0,
      y: 0,
      width: 1440,
      height: 182,
    })
  })

  it('never goes below the default band, however short the header claims to be', () => {
    const r = headerCropRegion('top-bar', { ...VIEWPORT, declaredHeightPx: 40 })
    expect(r.height).toBe(DEFAULT_HEADER_CROP_HEIGHT)
  })

  it('leaves room under the declared height so an overflowing header is visible', () => {
    const r = headerCropRegion('top-bar', { ...VIEWPORT, declaredHeightPx: 300 })
    expect(r.height).toBeGreaterThan(300)
  })

  it('never asks for more than the viewport', () => {
    const r = headerCropRegion('top-bar', { ...VIEWPORT, declaredHeightPx: 800 })
    expect(r.height).toBeLessThanOrEqual(VIEWPORT.height)
  })

  it('crops a vertical rail for a marginal header, not a horizontal band', () => {
    const left = headerCropRegion('left-rail', VIEWPORT)
    expect(left).toEqual({ x: 0, y: 0, width: 490, height: 900 })
    const right = headerCropRegion('right-margin', VIEWPORT)
    expect(right.height).toBe(900)
    expect(right.x + right.width).toBe(1440)
  })

  it('crops the foot for a footer-only header', () => {
    const r = headerCropRegion('footer-only', { ...VIEWPORT, declaredHeightPx: 96 })
    expect(r.y + r.height).toBe(900)
    expect(r.width).toBe(1440)
  })

  it('still takes the top band when there is no nav — the brand is usually still there', () => {
    expect(headerCropRegion('none', VIEWPORT).y).toBe(0)
    expect(headerCropRegion(null, VIEWPORT).height).toBe(DEFAULT_HEADER_CROP_HEIGHT)
  })

  it('falls back to a 1440x900 viewport when none is given', () => {
    expect(headerCropRegion('top-bar')).toEqual({ x: 0, y: 0, width: 1440, height: 160 })
  })
})

describe('markCropRegion', () => {
  // #503: the crop used to follow the declared placement, which on a
  // footer-only day is the bottom of the viewport whether or not the mark is
  // there. It follows the rendered mark now.
  const mark = { x: 64, y: 400, width: 48, height: 40 }

  it('centres the band on the mark', () => {
    const r = markCropRegion('top-bar', mark, { ...VIEWPORT, declaredHeightPx: 96 })
    expect(r).toEqual({ x: 0, y: 329, width: 1440, height: 182 })
    expect(r.y + r.height / 2).toBe(420)
  })

  it('takes the same band depth headerCropRegion would', () => {
    const declared = { ...VIEWPORT, declaredHeightPx: 300 }
    expect(markCropRegion('top-bar', mark, declared).height).toBe(
      headerCropRegion('top-bar', declared).height
    )
    expect(markCropRegion('top-bar', mark, VIEWPORT).height).toBe(DEFAULT_HEADER_CROP_HEIGHT)
  })

  it('clamps to the viewport at the top and the bottom', () => {
    expect(markCropRegion('top-bar', { ...mark, y: 8 }, VIEWPORT).y).toBe(0)
    const foot = markCropRegion('footer-only', { ...mark, y: 860 }, VIEWPORT)
    expect(foot.y + foot.height).toBe(VIEWPORT.height)
  })

  it('ignores the footer-only placement once a mark is found', () => {
    // The whole point: a footer-only declaration with the mark in the hero
    // crops the hero, not the foot.
    const r = markCropRegion('footer-only', { ...mark, y: 40 }, VIEWPORT)
    expect(r.y).toBe(0)
  })

  it('keeps the rail for a marginal header, anchored to the mark side', () => {
    const left = markCropRegion('left-rail', mark, VIEWPORT)
    expect(left).toEqual({ x: 0, y: 0, width: 490, height: 900 })
    const right = markCropRegion('right-margin', { ...mark, x: 1300 }, VIEWPORT)
    expect(right).toEqual({ x: 950, y: 0, width: 490, height: 900 })
    // A left-rail declaration with the mark rendered at the right follows the mark.
    expect(markCropRegion('left-rail', { ...mark, x: 1300 }, VIEWPORT).x).toBe(950)
  })

  it('falls back to a 1440x900 viewport when none is given', () => {
    expect(markCropRegion('top-bar', mark)).toEqual({ x: 0, y: 340, width: 1440, height: 160 })
  })
})

describe('describeHeaderCropAnchor', () => {
  it('says which path the crop took, and nothing for a capture that predates it', () => {
    expect(describeHeaderCropAnchor('mark')).toContain('centred on the rendered mark')
    expect(describeHeaderCropAnchor('placement')).toContain('No mark was found')
    expect(describeHeaderCropAnchor('placement')).toContain('declared placement')
    expect(describeHeaderCropAnchor(null)).toBe('')
    expect(describeHeaderCropAnchor(undefined)).toBe('')
  })
})

describe('buildMockupCriticBlocks — the header crop', () => {
  const base = {
    screenshotBuffer: buf('page'),
    enrichedBrief: 'brief',
    measurables: 'canvas_utilization_min: 70',
    shell: 'brand_lockup: horizontal-md',
  }

  it('sends the header declaration and the crop as a second image', () => {
    const blocks = buildMockupCriticBlocks({
      ...base,
      header: 'placement: top-bar\nmark_px: 44',
      headerCrop: buf('crop'),
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(2)
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('## Header Declaration')
    expect(text).toContain('mark_px: 44')
    expect(text).toMatch(/2x crop of the header region/)
  })

  it('tells the critic whether the crop is centred on the mark or on the declaration', () => {
    const text = (anchor) =>
      buildMockupCriticBlocks({
        ...base,
        header: 'mark_px: 44',
        headerCrop: buf('crop'),
        headerCropAnchor: anchor,
      })
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
    expect(text('mark')).toContain('centred on the rendered mark')
    expect(text('placement')).toContain('No mark was found')
  })

  it('drops to one image when the crop failed, rather than failing the round', () => {
    const blocks = buildMockupCriticBlocks({
      ...base,
      header: 'placement: corner',
      headerCrop: null,
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(1)
    expect(blocks.every((b) => b !== null)).toBe(true)
  })

  it('omits the header section entirely when nothing declared one', () => {
    const blocks = buildMockupCriticBlocks(base)
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).not.toContain('## Header Declaration')
  })
})

describe('buildScreenshotCriticBlocks — the two header crops', () => {
  const base = {
    enrichedBrief: 'brief',
    screenshotBuffer: { jpeg: buf('light'), darkJpeg: buf('dark'), headerJpeg: buf('render-crop') },
    mockupScreenshot: { jpeg: buf('mockup'), headerJpeg: buf('mockup-crop') },
  }

  it('sends mockup, light, dark, and both header crops in order', () => {
    const blocks = buildScreenshotCriticBlocks({ ...base, header: 'mark_px: 44' })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(5)
    expect(images.map((b) => Buffer.from(b.source.data, 'base64').toString())).toEqual([
      'mockup',
      'light',
      'dark',
      'mockup-crop',
      'render-crop',
    ])
  })

  it('carries the header declaration as text', () => {
    const text = buildScreenshotCriticBlocks({ ...base, header: 'mark_px: 44' })
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('## Header Declaration')
    expect(text).toContain('mark_px: 44')
  })

  it('says which path each crop took', () => {
    const text = buildScreenshotCriticBlocks({
      ...base,
      header: 'mark_px: 44',
      screenshotBuffer: { ...base.screenshotBuffer, headerCropAnchor: 'placement' },
      mockupScreenshot: { ...base.mockupScreenshot, headerCropAnchor: 'mark' },
    })
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toMatch(
      /APPROVED MOCKUP's header region\. The crop is centred on the rendered mark/
    )
    expect(text).toMatch(/RENDERED page's header region, same viewport\. No mark was found/)
  })

  it('keeps the crops when a calibration reference would push past the ceiling', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...base,
      header: 'mark_px: 44',
      bestReference: { buffer: buf('reference'), description: 'grade A' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images.length).toBeLessThanOrEqual(MAX_SCREENSHOT_CRITIC_IMAGES)
    expect(images.map((b) => Buffer.from(b.source.data, 'base64').toString())).toContain(
      'render-crop'
    )
  })

  it('omits a crop that failed to capture without dropping the rest', () => {
    const blocks = buildScreenshotCriticBlocks({
      enrichedBrief: 'brief',
      screenshotBuffer: { jpeg: buf('light'), darkJpeg: buf('dark'), headerJpeg: null },
      mockupScreenshot: { jpeg: buf('mockup'), headerJpeg: null },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(3)
    expect(blocks.every((b) => b !== null)).toBe(true)
  })
})
