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

  it('fits mockup, both schemes, the phone, both header crops, one route and a reference exactly', () => {
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
    expect(MAX_SCREENSHOT_CRITIC_IMAGES).toBe(8)
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

  it('carries phone filmstrips of other routes, prioritized over route shots and the reference', () => {
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
    // filmstrips = 8, the ceiling. The 1440 route shot and the calibration
    // reference are squeezed out entirely.
    expect(images).toHaveLength(MAX_SCREENSHOT_CRITIC_IMAGES)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/about'))).toBe(true)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/work/spaceman'))).toBe(true)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('Other surfaces'))).toBe(false)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('highest-rated'))).toBe(false)
  })

  it('drops a phone filmstrip capture failure without losing the rest', () => {
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      phoneFilmstrips: [{ label: 'A phone filmstrip of /about:', jpeg: null }],
    })
    expect(blocks.filter((b) => b.type === 'image')).toHaveLength(2)
    expect(blocks.some((b) => b.type === 'text' && b.text.includes('/about'))).toBe(false)
  })

  it('drops a share card before the phone when the ceiling binds', () => {
    // The phone is inside the fixed head of the list; route shots are what the
    // ceiling squeezes. A caller that still passes /og loses it, not the 360.
    const blocks = buildScreenshotCriticBlocks({
      ...baseCtx,
      screenshotBuffer: {
        ...baseCtx.screenshotBuffer,
        mobileJpeg: Buffer.from([0x07]),
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
