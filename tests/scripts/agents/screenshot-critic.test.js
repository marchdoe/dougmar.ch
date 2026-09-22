import { beforeEach, describe, expect, it, vi } from 'vitest'

const callVisionAgentMock = vi.fn()
vi.mock('../../../scripts/utils/vision-router.js', () => ({ callVisionAgent: callVisionAgentMock }))

const {
  buildScreenshotCriticBlocks,
  describeRevision,
  logNoRevision,
  MAX_SCREENSHOT_CRITIC_IMAGES,
  readRevisionRequest,
  recordFinalJudgment,
  runScreenshotCritic,
} = await import('../../../scripts/agents/screenshot-critic.js')
const { TABLET_VIEWPORT } = await import('../../../elements/chassis/viewports.js')
const { VisionTruncatedError } = await import('../../../scripts/utils/vision-truncated-error.js')
const { ModelTransportError } = await import('../../../scripts/utils/model-transport-error.js')

const baseCtx = {
  enrichedBrief: 'the brief',
  screenshotBuffer: {
    jpeg: Buffer.from([0xff, 0xd8, 0xff]),
    darkJpeg: Buffer.from([0xff, 0xd8, 0xfe]),
  },
}

describe('buildScreenshotCriticBlocks', () => {
  it('carries light + dark image blocks with no mockup or reference', () => {
    const blocks = buildScreenshotCriticBlocks(baseCtx)
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(2)
  })

  it('sends one desktop render, not two, when the dark capture matched the light one (#549)', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: { jpeg: baseCtx.screenshotBuffer.jpeg, darkJpeg: null },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(1)
    const texts = blocks.filter((b) => b.type === 'text').map((b) => b.text)
    expect(texts.some((t) => t.includes('DARK scheme'))).toBe(false)
    expect(texts.some((t) => t.includes('BOTH color schemes'))).toBe(false)
    expect(texts.some((t) => t.includes('defines one color scheme'))).toBe(true)
  })

  it('carries the SHELL declaration as text ahead of the header, and omits it when absent (#505)', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      shell: 'brand_lockup: stacked-md\nground_material: grain',
      header: 'placement: top-bar',
    })
    const texts = blocks.filter((b) => b.type === 'text').map((b) => b.text)
    const shellIdx = texts.findIndex((t) => t.startsWith('## Shell Declaration'))
    expect(shellIdx).toBeGreaterThan(-1)
    expect(texts[shellIdx]).toContain('ground_material: grain')
    expect(shellIdx).toBeLessThan(texts.findIndex((t) => t.startsWith('## Header Declaration')))
    expect(
      buildScreenshotCriticBlocks(baseCtx).some(
        (b) => b.type === 'text' && b.text.startsWith('## Shell Declaration')
      )
    ).toBe(false)
  })

  it('adds a mockup image block when a mockup screenshot is provided', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      mockupScreenshot: { jpeg: Buffer.from([0x01]) },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(3)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('APPROVED MOCKUP'))).toBe(true)
  })

  it('adds the best-rated reference as a fourth image, labeled, PNG media type', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      mockupScreenshot: { jpeg: Buffer.from([0x01]) },
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(4)
    expect(images[images.length - 1].source.media_type).toBe('image/png')
    expect(blocks.some((b) => b.type === 'text' && b.text.includes("owner's highest-rated"))).toBe(
      true
    )
  })

  it('degrades gracefully with no reference: no extra block, no image added', () => {
    const blocks = buildScreenshotCriticBlocks({ ...baseCtx, bestReference: null })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(2)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('highest-rated'))).toBe(false)
  })

  it('never exceeds MAX_SCREENSHOT_CRITIC_IMAGES even when a reference is present', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      mockupScreenshot: { jpeg: Buffer.from([0x01]) },
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    expect(blocks.filter((b) => b.type === 'image').length).toBeLessThanOrEqual(
      MAX_SCREENSHOT_CRITIC_IMAGES
    )
  })

  it('includes design references as text when provided', () => {
    const blocks = buildScreenshotCriticBlocks({ ...baseCtx, references: 'reference notes' })
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).toContain('reference notes')
  })

  it('carries the measured faults as text, ahead of every image', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      measuredFaults: '## Measured layout faults\n\n- [error] /experiments at 1440px: 657px wider',
    })
    const firstImage = blocks.findIndex((b) => b.type === 'image')
    const faultsAt = blocks.findIndex((b) => b.type === 'text' && b.text.includes('657px wider'))
    expect(faultsAt).toBeGreaterThan(-1)
    // The model should read what is already established before it starts
    // forming opinions from a downscaled JPEG.
    expect(faultsAt).toBeLessThan(firstImage)
  })

  it('omits the faults block entirely when nothing was measured wrong', () => {
    const blocks = buildScreenshotCriticBlocks({ ...baseCtx, measuredFaults: '' })
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('Measured layout faults'))).toBe(
      false
    )
  })

  // #635: the final re-judge hit its 16,000-token output cap twice on
  // 2026-09-21. The measured faults block is exact and already final by the
  // time a rejudge runs — nothing the critic adds to it is new — so a
  // rejudge is told not to restate it as an Issue, where a first pass gets
  // no such instruction: it still needs the critic driving that round's
  // revision.
  it('tells a rejudge not to re-list the measured faults it was given (#635)', () => {
    const ctx = {
      ...baseCtx,
      measuredFaults: '## Measured layout faults\n\n- [error] /experiments at 1440px: 657px wider',
    }
    const rejudgeText = buildScreenshotCriticBlocks({ ...ctx, purpose: 'rejudge' })
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(rejudgeText).toMatch(/final re-judge/i)
    expect(rejudgeText).toMatch(/do not list a measured fault/i)

    const firstPassText = buildScreenshotCriticBlocks({ ...ctx, purpose: 'first' })
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(firstPassText).not.toMatch(/final re-judge/i)

    const noPurposeText = buildScreenshotCriticBlocks(ctx)
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(noPurposeText).not.toMatch(/final re-judge/i)
  })

  it('adds no rejudge instruction when nothing was measured wrong', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      measuredFaults: '',
      purpose: 'rejudge',
    })
    expect(blocks.some((b) => b.type === 'text' && /final re-judge/i.test(b.text))).toBe(false)
  })

  it('adds route captures as PNG, announced once', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      routeShots: [
        { label: 'A project page (/work/spaceman):', png: Buffer.from([0x89, 0x50]) },
        { label: 'The share card (/og):', png: Buffer.from([0x89, 0x51]) },
      ],
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(4)
    expect(images.slice(2).every((i) => i.source.media_type === 'image/png')).toBe(true)
    const announcements = blocks.filter(
      (b) => b.type === 'text' && b.text.includes('Other surfaces this build rewrote')
    )
    expect(announcements).toHaveLength(1)
  })

  it('drops route captures rather than crowding out the calibration reference', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      mockupScreenshot: { jpeg: Buffer.from([0x01]) },
      routeShots: [
        { label: 'one:', png: Buffer.from([0x01]) },
        { label: 'two:', png: Buffer.from([0x02]) },
        { label: 'three:', png: Buffer.from([0x03]) },
        { label: 'four:', png: Buffer.from([0x04]) },
        { label: 'five:', png: Buffer.from([0x05]) },
        { label: 'six:', png: Buffer.from([0x06]) },
      ],
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
    // The reference is the last image, so calibration survives the squeeze.
    expect(images[images.length - 1].source.data).toBe(
      Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64')
    )
  })

  it('fits mockup, both schemes, the phone, both header crops, one route and a reference', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: {
        ...baseCtx.screenshotBuffer,
        mobileJpeg: Buffer.from([0x07]),
        headerJpeg: Buffer.from([0x05]),
      },
      mockupScreenshot: { jpeg: Buffer.from([0x01]), headerJpeg: Buffer.from([0x06]) },
      routeShots: [{ label: 'A project page (/work/spaceman):', png: Buffer.from([0x02]) }],
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(8)
    expect(MAX_SCREENSHOT_CRITIC_IMAGES).toBe(9)
    // Crops come before route shots, route shots before the reference — the
    // drop order when the ceiling binds is the reverse of this.
    const labels = blocks.filter((b) => b.type === 'text').map((b) => b.text)
    const at = (needle) => labels.findIndex((t) => t.includes(needle))
    expect(at('RENDERED page')).toBeLessThan(at('Other surfaces'))
    expect(at('Other surfaces')).toBeLessThan(at('highest-rated'))
  })

  it('carries the phone filmstrip next to its desktop counterpart, both labelled', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: { ...baseCtx.screenshotBuffer, mobileJpeg: Buffer.from([0x07]) },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(3)

    const kinds = blocks.map((b) => (b.type === 'image' ? 'image' : b.text))
    const light = kinds.findIndex((k) => k.includes('LIGHT scheme, 1440×900'))
    const phone = kinds.findIndex((k) => k.includes('phone filmstrip'))
    const dark = kinds.findIndex((k) => k.includes('DARK scheme, 1440×900'))
    // light label, light image, phone label, phone image, dark label, dark image
    expect(phone).toBe(light + 2)
    expect(dark).toBe(phone + 2)
    expect(kinds[phone + 1]).toBe('image')
    expect(images[1].source.data).toBe(Buffer.from([0x07]).toString('base64'))
  })

  it('drops the phone block rather than the run when the capture failed', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: { ...baseCtx.screenshotBuffer, mobileJpeg: null },
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(2)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('phone filmstrip'))).toBe(false)
  })

  it('carries phone filmstrips of other routes ahead of route shots, and the reference takes the last slot', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: {
        ...baseCtx.screenshotBuffer,
        mobileJpeg: Buffer.from([0x07]),
        headerJpeg: Buffer.from([0x05]),
      },
      mockupScreenshot: { jpeg: Buffer.from([0x01]), headerJpeg: Buffer.from([0x06]) },
      phoneFilmstrips: [
        { label: 'A phone filmstrip of /about:', jpeg: Buffer.from([0x08]) },
        { label: 'A phone filmstrip of /work/spaceman:', jpeg: Buffer.from([0x09]) },
      ],
      routeShots: [{ label: 'A project page (/work/spaceman):', png: Buffer.from([0x02]) }],
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    // mockup + light + home phone + dark + 2 header crops + 2 phone
    // filmstrips = 8. The 1440 route shot is squeezed out, the reference
    // takes the ninth.
    expect(images).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/about'))).toBe(true)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/work/spaceman'))).toBe(true)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('Other surfaces'))).toBe(false)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('highest-rated'))).toBe(true)
  })

  it('drops a phone filmstrip capture failure without losing the rest', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      phoneFilmstrips: [{ label: 'A phone filmstrip of /about:', jpeg: null }],
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(2)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/about'))).toBe(false)
  })

  describe('the tablet still (#565)', () => {
    const tablet = Buffer.from([0x0a])
    const full = {
      screenshotBuffer: {
        ...baseCtx.screenshotBuffer,
        mobileJpeg: Buffer.from([0x07]),
        tabletJpeg: tablet,
        headerJpeg: Buffer.from([0x05]),
      },
      mockupScreenshot: { jpeg: Buffer.from([0x01]), headerJpeg: Buffer.from([0x06]) },
      phoneFilmstrips: [
        { label: 'A phone filmstrip of /about:', jpeg: Buffer.from([0x08]) },
        { label: 'A phone filmstrip of /work/spaceman:', jpeg: Buffer.from([0x09]) },
      ],
      desktopFilmstrips: [
        { label: 'A desktop filmstrip of /work/spaceman:', jpeg: Buffer.from([0x0c]) },
      ],
      routeShots: [{ label: 'A project page (/work/spaceman):', png: Buffer.from([0x02]) }],
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    }
    const textsOf = (blocks) => blocks.filter((b) => b.type === 'text').map((b) => b.text)
    const has = (blocks, needle) => textsOf(blocks).some((t) => t.includes(needle))
    const singleMode = {
      ...full,
      screenshotBuffer: { ...full.screenshotBuffer, darkJpeg: null },
    }

    it('follows the phone filmstrip and precedes the dark capture, labelled with its width', () => {
      const blocks = buildScreenshotCriticBlocks(full)
      const kinds = blocks.map((b) => (b.type === 'image' ? 'image' : b.text))
      const phone = kinds.findIndex((k) => k.includes('phone filmstrip of that SAME page'))
      const tabletAt = kinds.findIndex((k) => k.includes('TABLET'))
      const dark = kinds.findIndex((k) => k.includes('DARK scheme, 1440×900'))
      expect(tabletAt).toBe(phone + 2)
      expect(dark).toBe(tabletAt + 2)
      expect(kinds[tabletAt]).toContain(`${TABLET_VIEWPORT.width}×${TABLET_VIEWPORT.height}`)
      expect(blocks[tabletAt + 1].source.data).toBe(tablet.toString('base64'))
    })

    it('is dropped alone when the capture failed', () => {
      const blocks = buildScreenshotCriticBlocks({
        ...full,
        screenshotBuffer: { ...full.screenshotBuffer, tabletJpeg: null },
      })
      expect(has(blocks, 'TABLET')).toBe(false)
      expect(has(blocks, 'phone filmstrip of that SAME page')).toBe(true)
    })

    it('costs a night with no dark capture and no motion strip its calibration reference and nothing else', () => {
      // Dark matched light, no motion: mockup, light, phone, tablet, two crops,
      // the desktop filmstrip and both phone filmstrips fill the nine. The 1440
      // project page was already squeezed out, so the reference goes.
      const blocks = buildScreenshotCriticBlocks(singleMode)
      expect(blocks.filter((b) => b.type === 'image')).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
      expect(has(blocks, 'TABLET')).toBe(true)
      expect(has(blocks, 'A desktop filmstrip of /work/spaceman:')).toBe(true)
      expect(has(blocks, 'A phone filmstrip of /about:')).toBe(true)
      expect(has(blocks, 'A phone filmstrip of /work/spaceman:')).toBe(true)
      expect(has(blocks, 'Other surfaces')).toBe(false)
      expect(has(blocks, 'highest-rated')).toBe(false)
    })

    it('costs a night with a dark capture the case-study phone filmstrip, and the desktop one stays', () => {
      const blocks = buildScreenshotCriticBlocks(full)
      expect(blocks.filter((b) => b.type === 'image')).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
      expect(has(blocks, 'TABLET')).toBe(true)
      expect(has(blocks, 'A desktop filmstrip of /work/spaceman:')).toBe(true)
      expect(has(blocks, 'A phone filmstrip of /about:')).toBe(true)
      expect(has(blocks, 'A phone filmstrip of /work/spaceman:')).toBe(false)
    })

    it('costs a night with a dark capture and a motion strip both phone filmstrips, never the tablet, a crop or the desktop filmstrip', () => {
      const blocks = buildScreenshotCriticBlocks({
        ...full,
        screenshotBuffer: { ...full.screenshotBuffer, motionStripJpeg: Buffer.from([0x0b]) },
      })
      expect(blocks.filter((b) => b.type === 'image')).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
      expect(has(blocks, 'TABLET')).toBe(true)
      expect(has(blocks, 'RENDERED page')).toBe(true)
      expect(has(blocks, 'MOTION STRIP')).toBe(true)
      expect(has(blocks, 'A desktop filmstrip of /work/spaceman:')).toBe(true)
      expect(has(blocks, 'phone filmstrip of /')).toBe(false)
    })
  })

  describe('the desktop filmstrip of the case study (#569)', () => {
    const desktop = { label: 'A desktop filmstrip of /work/spaceman:', jpeg: Buffer.from([0x0c]) }
    const phone = [
      { label: 'A phone filmstrip of /about:', jpeg: Buffer.from([0x08]) },
      { label: 'A phone filmstrip of /work/spaceman:', jpeg: Buffer.from([0x09]) },
    ]

    it('comes ahead of the phone filmstrips, and is one image', () => {
      const blocks = buildScreenshotCriticBlocks({
        ...baseCtx,
        phoneFilmstrips: phone,
        desktopFilmstrips: [desktop],
      })
      const texts = blocks.filter((b) => b.type === 'text').map((b) => b.text)
      const at = (needle) => texts.findIndex((t) => t.includes(needle))
      expect(at('A desktop filmstrip')).toBeGreaterThan(-1)
      expect(at('A desktop filmstrip')).toBeLessThan(at('A phone filmstrip of /about'))
      const i = blocks.findIndex((b) => b.type === 'text' && b.text.includes('A desktop filmstrip'))
      expect(blocks[i + 1].type).toBe('image')
      expect(blocks[i + 1].source.data).toBe(desktop.jpeg.toString('base64'))
    })

    it('is dropped alone when the capture failed, with its label', () => {
      const blocks = buildScreenshotCriticBlocks({
        ...baseCtx,
        phoneFilmstrips: phone,
        desktopFilmstrips: [{ ...desktop, jpeg: null }],
      })
      expect(blocks.some((b) => b.type === 'text' && b.text.includes('A desktop filmstrip'))).toBe(
        false
      )
      expect(blocks.filter((b) => b.type === 'image')).toHaveLength(4)
    })

    // Every shape a night can take, as flags: the head of the list, then what
    // competes for the rest. The ceiling has to hold for all of them, and the
    // drop order has to hold with it.
    const FLAGS = [
      'mockup',
      'mockupHeader',
      'header',
      'phone',
      'tablet',
      'dark',
      'motion',
      'desktop',
      'aboutPhone',
      'casePhone',
      'routeShot',
      'reference',
    ]
    const shape = (mask) => Object.fromEntries(FLAGS.map((f, i) => [f, Boolean(mask & (1 << i))]))
    const buf = (n) => Buffer.from([n])
    const headOf = (f) => ({
      jpeg: buf(1),
      darkJpeg: f.dark ? buf(2) : null,
      mobileJpeg: f.phone ? buf(3) : null,
      tabletJpeg: f.tablet ? buf(4) : null,
      headerJpeg: f.header ? buf(5) : null,
      motionStripJpeg: f.motion ? buf(6) : null,
    })
    const mockupOf = (f) =>
      f.mockup ? { jpeg: buf(7), headerJpeg: f.mockupHeader ? buf(8) : null } : null
    const ctxFor = (f) => ({
      ...baseCtx,
      screenshotBuffer: headOf(f),
      mockupScreenshot: mockupOf(f),
      desktopFilmstrips: f.desktop ? [desktop] : [],
      phoneFilmstrips: phone.filter((_, i) => f[i === 0 ? 'aboutPhone' : 'casePhone']),
      routeShots: f.routeShot ? [{ label: 'A project page:', png: buf(9) }] : [],
      bestReference: f.reference ? { buffer: buf(10), description: 'ref' } : null,
    })
    const imagesOf = (blocks) => blocks.filter((b) => b.type === 'image').length
    const has = (blocks, needle) => blocks.some((b) => b.type === 'text' && b.text.includes(needle))
    const shapes = Array.from({ length: 1 << FLAGS.length }, (_, mask) => ({
      mask,
      flags: shape(mask),
    }))

    it('never sends more images than the ceiling, for every shape of night', () => {
      let worst = 0
      for (const { mask, flags } of shapes) {
        const n = imagesOf(buildScreenshotCriticBlocks(ctxFor(flags)))
        worst = Math.max(worst, n)
        expect(n, `shape ${mask.toString(2)}`).toBeLessThanOrEqual(MAX_SCREENSHOT_CRITIC_IMAGES)
      }
      // Some shape reaches the ceiling, so the check above is not vacuous.
      expect(worst).toBe(MAX_SCREENSHOT_CRITIC_IMAGES)
    })

    it('keeps the desktop filmstrip whenever a phone filmstrip of a route survives', () => {
      for (const { mask, flags } of shapes.filter((s) => s.flags.desktop)) {
        const blocks = buildScreenshotCriticBlocks(ctxFor(flags))
        if (has(blocks, 'A phone filmstrip of /')) {
          expect(has(blocks, 'A desktop filmstrip'), `shape ${mask.toString(2)}`).toBe(true)
        }
      }
    })

    it('never drops a crop, the tablet or the motion strip to make room for it', () => {
      for (const { mask, flags } of shapes.filter((s) => s.flags.desktop)) {
        const withIt = buildScreenshotCriticBlocks(ctxFor(flags))
        const without = buildScreenshotCriticBlocks(ctxFor({ ...flags, desktop: false }))
        for (const needle of ['RENDERED page', 'APPROVED MOCKUP', 'TABLET', 'MOTION STRIP']) {
          const lost = has(without, needle) && !has(withIt, needle)
          expect(lost, `${needle} in shape ${mask.toString(2)}`).toBe(false)
        }
      }
    })

    it('fits a night with a dark capture and a motion strip only by dropping every phone filmstrip', () => {
      const flags = {
        ...Object.fromEntries(FLAGS.map((k) => [k, true])),
        routeShot: false,
        reference: false,
      }
      const blocks = buildScreenshotCriticBlocks(ctxFor(flags))
      // mockup + light + phone + tablet + dark + 2 crops + motion = 8, then the one slot.
      expect(imagesOf(blocks)).toBe(MAX_SCREENSHOT_CRITIC_IMAGES)
      expect(has(blocks, 'A desktop filmstrip')).toBe(true)
      expect(has(blocks, 'A phone filmstrip of /')).toBe(false)
    })
  })

  it('drops a share card before the phone when the ceiling binds', () => {
    // The phone is inside the fixed head of the list; route shots are what the
    // ceiling squeezes. A caller that still passes /og loses it, not the 360.
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: {
        ...baseCtx.screenshotBuffer,
        mobileJpeg: Buffer.from([0x07]),
        tabletJpeg: Buffer.from([0x0a]),
        headerJpeg: Buffer.from([0x05]),
      },
      mockupScreenshot: { jpeg: Buffer.from([0x01]), headerJpeg: Buffer.from([0x06]) },
      routeShots: [
        { label: 'A project page (/work/spaceman):', png: Buffer.from([0x02]) },
        { label: 'The share card (/og):', png: Buffer.from([0x03]) },
      ],
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const images = blocks.filter((b) => b.type === 'image')
    expect(images).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('phone filmstrip'))).toBe(true)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('share card'))).toBe(false)
  })

  it('never inlines screenshot bytes as base64 text', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      mockupScreenshot: { jpeg: Buffer.from([0x01]) },
      bestReference: { buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]), description: 'ref' },
    })
    const text = blocks
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    expect(text).not.toContain('base64')
  })
})

describe('runScreenshotCritic', () => {
  const ask = (wantsBar = false) =>
    runScreenshotCritic({ systemPrompt: 'sys', contentBlocks: [], wantsBar })

  /** The router reports its channel through onChannel before it answers. */
  function answerOn(channel, text) {
    callVisionAgentMock.mockImplementation(async (args) => {
      args.onChannel(channel)
      return text
    })
  }

  beforeEach(() => {
    callVisionAgentMock.mockReset()
  })

  it('reads the verdict and the BAR line from a critic that saw the build', async () => {
    answerOn(
      'sdk-vision',
      '===VERDICT===\nSHIP\n===END===\nBAR: below — flatter than the reference'
    )

    expect(await ask(true)).toMatchObject({
      verdict: 'SHIP',
      visionChannel: 'sdk-vision',
      bar: { position: 'below', reason: 'flatter than the reference' },
    })
    expect((await ask(false)).bar).toBeNull()
  })

  it('keeps a REVISE from a critic that saw the build', async () => {
    answerOn('sdk-vision', '===VERDICT===\nREVISE\n===END===')

    expect(await ask()).toMatchObject({ verdict: 'REVISE', visionChannel: 'sdk-vision' })
  })

  it('says UNVERIFIED for a truncated reply, with the reason and no BAR (#570)', async () => {
    const reason =
      '[screenshot-critic] response truncated at max_tokens (6000 output tokens, cap 6000)'
    callVisionAgentMock.mockRejectedValue(
      new VisionTruncatedError({ agent: 'screenshot-critic', reason })
    )

    expect(await ask(true)).toEqual({
      verdict: 'UNVERIFIED',
      criticResponse: reason,
      visionChannel: 'sdk-vision-truncated',
      bar: null,
    })
  })

  it.each(['cli-text-fallback', 'cli-text-no-key', 'cli-text-no-images', 'fixture-replay'])(
    'says UNVERIFIED for a REVISE that reached us on %s (#570)',
    async (channel) => {
      answerOn(channel, '===VERDICT===\nREVISE\n===END===\nBAR: above — fine')

      expect(await ask(true)).toMatchObject({
        verdict: 'UNVERIFIED',
        visionChannel: channel,
        bar: null,
      })
    }
  )

  it('lets any other failure through', async () => {
    callVisionAgentMock.mockRejectedValue(
      new ModelTransportError({
        agent: 'screenshot-critic',
        channel: 'cli-text-fallback',
        emptyReply: true,
      })
    )

    await expect(ask()).rejects.toBeInstanceOf(ModelTransportError)
  })
})

describe('readRevisionRequest', () => {
  it('sends a REVISE to the agent the critic named', () => {
    const reply =
      '===VERDICT===\nREVISE\n===FEEDBACK===\nThe hero is undersized.\n**Responsible agent:** mockup-designer\n===END==='

    expect(readRevisionRequest('REVISE', reply).responsibleAgent).toBe('mockup-designer')
  })

  it('falls back to the engineer when a REVISE names no agent', () => {
    expect(readRevisionRequest('REVISE', '===VERDICT===\nREVISE\n===END===').responsibleAgent).toBe(
      'react-engineer'
    )
  })

  it('takes the FEEDBACK block up to ===END===', () => {
    const reply =
      '===VERDICT===\nREVISE\n===FEEDBACK===\nThe hero is undersized.\n===END===\nBAR: x'

    expect(readRevisionRequest('REVISE', reply).criticFeedback).toBe('The hero is undersized.')
  })

  it('takes a FEEDBACK block that never closes to the end of the reply', () => {
    const reply = '===VERDICT===\nREVISE\n===FEEDBACK===\nThe hero is undersized.\nAnd the nav.'

    expect(readRevisionRequest('REVISE', reply).criticFeedback).toBe(
      'The hero is undersized.\nAnd the nav.'
    )
  })

  it('strips the frame from a reply with no FEEDBACK block, keeping REVISE inside the prose', () => {
    const reply = '===VERDICT===\nREVISE\nREVISE the hero scale.\n===END==='

    expect(readRevisionRequest('REVISE', reply).criticFeedback).toBe('REVISE the hero scale.')
  })

  it.each(['SHIP', 'UNVERIFIED'])(
    'gives a %s no critique and no agent but the engineer, whatever the reply says',
    (verdict) => {
      const reply =
        '===VERDICT===\nREVISE\n===FEEDBACK===\nA finding.\n**Responsible agent:** mockup-designer\n===END==='

      expect(readRevisionRequest(verdict, reply)).toEqual({
        responsibleAgent: 'react-engineer',
        criticFeedback: '',
      })
    }
  )
})

describe('describeRevision', () => {
  it('names the responsible agent for a critic REVISE', () => {
    expect(describeRevision('REVISE', 'react-engineer', 3)).toBe(
      '  [screenshot-critic] REVISE — responsible: react-engineer'
    )
  })

  it('says the gate is revising anyway after a SHIP', () => {
    expect(describeRevision('SHIP', 'react-engineer', 2)).toBe(
      '  [surface-gate] critic said SHIP; revising anyway for 2 measured fault(s)'
    )
  })

  it('says the critic gave no verdict after an UNVERIFIED (#570)', () => {
    expect(describeRevision('UNVERIFIED', 'react-engineer', 1)).toBe(
      '  [surface-gate] critic gave no verdict; revising anyway for 1 measured fault(s)'
    )
  })
})

describe('logNoRevision', () => {
  beforeEach(() => {
    // tests/setup.js already silences console; clear what earlier tests logged.
    vi.spyOn(console, 'log')
      .mockImplementation(() => {})
      .mockClear()
    vi.spyOn(console, 'warn')
      .mockImplementation(() => {})
      .mockClear()
  })

  it('warns that the build ships as-is when the critic gave no verdict (#570)', () => {
    logNoRevision('UNVERIFIED', 'sdk-vision-truncated')

    expect(console.warn).toHaveBeenCalledWith(
      '  [screenshot-critic] no verdict (sdk-vision-truncated) — no critic-driven revision, shipping the build as-is'
    )
    expect(console.log).not.toHaveBeenCalled()
  })

  it('logs a plain SHIP otherwise', () => {
    logNoRevision('SHIP', 'sdk-vision')

    expect(console.log).toHaveBeenCalledWith('  [screenshot-critic] SHIP')
    expect(console.warn).not.toHaveBeenCalled()
  })
})

describe('recordFinalJudgment', () => {
  beforeEach(() => {
    // tests/setup.js already silences console; clear what earlier tests logged.
    vi.spyOn(console, 'log')
      .mockImplementation(() => {})
      .mockClear()
    vi.spyOn(console, 'warn')
      .mockImplementation(() => {})
      .mockClear()
  })

  const judged = (verdict, visionChannel, criticResponse = 'the critique') => ({
    verdict,
    criticResponse,
    visionChannel,
  })

  it('records a SHIP from a critic that saw the build, and nothing else', () => {
    const verdicts = []

    expect(recordFinalJudgment(verdicts, judged('SHIP', 'sdk-vision'), '')).toBe('SHIP')

    expect(verdicts).toEqual([
      {
        critic: 'screenshot-critic',
        round: 'final',
        verdict: 'SHIP',
        feedback: 'the critique',
        channel: 'sdk-vision',
        ts: expect.any(Number),
      },
    ])
    expect(console.log).toHaveBeenCalledWith('  [screenshot-critic] final verdict: SHIP')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('ships a final REVISE with the faults logged, critique first and measured faults after', () => {
    const verdicts = []

    expect(
      recordFinalJudgment(verdicts, judged('REVISE', 'sdk-vision', 'still wrong'), '- [error] /: x')
    ).toBe('REVISE')

    expect(verdicts.map((v) => [v.critic, v.verdict])).toEqual([
      ['screenshot-critic', 'REVISE'],
      ['ship-gate', 'SHIPPED-WITH-FAULTS'],
    ])
    expect(verdicts[1].feedback).toBe('still wrong\n\n- [error] /: x')
    expect(console.warn).toHaveBeenCalledWith(
      '  [ship-gate] final critic still says REVISE — shipping with the faults logged'
    )
  })

  it('leaves the blank out of the ship-gate feedback when the second measurement was clean', () => {
    const verdicts = []

    recordFinalJudgment(verdicts, judged('REVISE', 'sdk-vision', 'still wrong'), '')

    expect(verdicts[1].feedback).toBe('still wrong')
  })

  it.each(['cli-text-fallback', 'cli-text-no-images', 'sdk-vision-truncated'])(
    'records UNVERIFIED, never SHIPPED-WITH-FAULTS, for a REVISE that reached us on %s (#486)',
    (channel) => {
      const verdicts = []

      expect(recordFinalJudgment(verdicts, judged('REVISE', channel), '- [error] /: x')).toBe(
        'UNVERIFIED'
      )

      expect(verdicts).toHaveLength(1)
      expect(verdicts[0]).toMatchObject({ verdict: 'UNVERIFIED', channel, round: 'final' })
      expect(console.warn).toHaveBeenCalledWith(
        `  [screenshot-critic] final re-judge did not reach the SDK vision channel (${channel}) — recording UNVERIFIED instead of a faults verdict`
      )
    }
  )

  it('caps the recorded critique at 2000 characters', () => {
    const verdicts = []

    recordFinalJudgment(verdicts, judged('REVISE', 'sdk-vision', 'x'.repeat(2500)), 'faults')

    expect(verdicts[0].feedback).toHaveLength(2000)
    expect(verdicts[1].feedback).toBe(`${'x'.repeat(2000)}\n\nfaults`)
  })
})
