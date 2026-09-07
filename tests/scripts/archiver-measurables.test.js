/**
 * #456: the declared MEASURABLES floors were parsed every night and thrown
 * away, and `fidelity()` returned null on every build there ever was because
 * nothing ever supplied the achieved side. This exercises the two halves
 * archive() now assembles into measurables.json: the declared block
 * archiveArtifacts() writes up front, and the measured block this file's
 * tests focus on — merged in from the same browser pass the responsive
 * scorer already runs, at the desktop rung.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFile } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { tempRepoRoot } from '../helpers/tmp.js'

const withPreviewServerMock = vi.fn(async (fn) => await fn('http://fake-preview.test/'))
vi.mock('../../scripts/utils/snapshot.js', () => ({
  captureSnapshot: vi.fn().mockResolvedValue(undefined),
  withPreviewServer: (...args) => withPreviewServerMock(...args),
}))

const closeMock = vi.fn().mockResolvedValue(undefined)
vi.mock('@playwright/test', () => ({
  chromium: { launch: vi.fn().mockResolvedValue({ close: closeMock }) },
}))

const screenshotViewportsMock = vi.fn().mockResolvedValue([])
vi.mock('../../scripts/utils/viewport-screenshotter.js', () => ({
  screenshotViewports: (...args) => screenshotViewportsMock(...args),
}))

const scoreResponsiveMock = vi.fn()
vi.mock('../../scripts/utils/responsive-scorer.js', () => ({
  scoreResponsive: (...args) => scoreResponsiveMock(...args),
}))

vi.mock('../../scripts/seal-archive.js', () => ({
  sealArchive: vi.fn().mockResolvedValue({ dates: 0, scanned: 0, changed: [] }),
}))

const { archive } = await import('../../scripts/utils/archiver.js')

function buildDirOf(root, date) {
  const dateDir = path.join(root, 'archive', date)
  const build = readdirSync(dateDir).find((d) => /^build-\d+$/.test(d))
  return path.join(dateDir, build)
}

const MEASURED = { canvas_utilization: 82.5, color_coverage: 41.2, hero_px: 128 }

describe('archive() — measurables.json (#456)', () => {
  let root
  beforeEach(async () => {
    root = await tempRepoRoot('dm-measurables-')
    withPreviewServerMock.mockClear()
    screenshotViewportsMock.mockClear()
    scoreResponsiveMock.mockReset()
  })

  it('merges the measured numbers onto the declared block already on disk', async () => {
    scoreResponsiveMock.mockResolvedValue({
      viewports: { desktop: { width: 1440, height: 900, checks: {}, score: 5 } },
      overallScore: 5,
      worstFailure: null,
      measured: MEASURED,
    })

    const date = '2099-06-01'
    const declared = {
      canvas_utilization_min: 80,
      hero_scale: 'clamp(96px, 13vw, 200px)',
      color_coverage_min: 40,
    }
    await archive(
      date,
      { date },
      'rationale',
      'brief',
      [],
      {},
      null,
      null,
      { 'measurables.json': JSON.stringify({ declared, declaredAt: '2099-06-01T00:00:00.000Z' }) },
      { root: root }
    )

    const measurablesPath = path.join(buildDirOf(root, date), 'measurables.json')
    expect(existsSync(measurablesPath)).toBe(true)
    const measurables = JSON.parse(await readFile(measurablesPath, 'utf8'))
    expect(measurables.declared).toEqual(declared)
    expect(measurables.measured).toEqual(MEASURED)
    expect(measurables.measuredAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(typeof measurables.method).toBe('string')
    expect(measurables.method.length).toBeGreaterThan(0)
  })

  it('does not create measurables.json from measurement alone when nothing declared it', async () => {
    // No declared block passed in via artifacts — this is what every build
    // before the Art Director wired measurablesDecl through would look like.
    scoreResponsiveMock.mockResolvedValue({
      viewports: { desktop: { width: 1440, height: 900, checks: {}, score: 5 } },
      overallScore: 5,
      worstFailure: null,
      measured: MEASURED,
    })

    const date = '2099-06-02'
    await archive(date, { date }, 'rationale', 'brief', [], {}, null, null, {}, { root: root })

    const measurablesPath = path.join(buildDirOf(root, date), 'measurables.json')
    expect(existsSync(measurablesPath)).toBe(false)
  })

  it('keeps responsive-metrics.json free of the measured payload', async () => {
    scoreResponsiveMock.mockResolvedValue({
      viewports: { desktop: { width: 1440, height: 900, checks: {}, score: 5 } },
      overallScore: 5,
      worstFailure: null,
      measured: MEASURED,
    })

    const date = '2099-06-03'
    await archive(date, { date }, 'rationale', 'brief', [], {}, null, null, {}, { root: root })

    const metricsPath = path.join(buildDirOf(root, date), 'responsive-metrics.json')
    const metrics = JSON.parse(await readFile(metricsPath, 'utf8'))
    expect(metrics.measured).toBeUndefined()
  })

  it('degrades to fidelity: null in uniqueness.json when the scorer reports no measured numbers', async () => {
    scoreResponsiveMock.mockResolvedValue({
      viewports: { desktop: { width: 1440, height: 900, checks: {}, score: 5 } },
      overallScore: 5,
      worstFailure: null,
      measured: null,
    })

    const date = '2099-06-04'
    await archive(date, { date }, 'rationale', 'brief', [], {}, null, null, {}, { root: root })

    const uniquenessPath = path.join(buildDirOf(root, date), 'uniqueness.json')
    const uniqueness = JSON.parse(await readFile(uniquenessPath, 'utf8'))
    expect(uniqueness.metrics.fidelity.score).toBeNull()
  })

  it('passes declared and measured through to uniqueness.json when both exist', async () => {
    scoreResponsiveMock.mockResolvedValue({
      viewports: { desktop: { width: 1440, height: 900, checks: {}, score: 5 } },
      overallScore: 5,
      worstFailure: null,
      measured: { canvas_utilization: 90, color_coverage: 55, hero_px: 128 },
    })

    const date = '2099-06-05'
    const declared = { canvas_utilization_min: 80, hero_scale: '12vw', color_coverage_min: 40 }
    await archive(
      date,
      { date },
      'rationale',
      'brief',
      [],
      {},
      null,
      null,
      { 'measurables.json': JSON.stringify({ declared, declaredAt: '2099-06-05T00:00:00.000Z' }) },
      { root: root }
    )

    const uniquenessPath = path.join(buildDirOf(root, date), 'uniqueness.json')
    const uniqueness = JSON.parse(await readFile(uniquenessPath, 'utf8'))
    expect(uniqueness.metrics.fidelity.score).toBe(1)
    expect(uniqueness.metrics.fidelity.checks).toHaveLength(2)
  })
})
