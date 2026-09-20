/**
 * The width the critics are shown a phone at, against the width the gate
 * measures one at, the archiver scores one at and the type ramp bottoms out
 * at.
 *
 * These were four copies of one number. If two disagree, a critic approves a
 * composition at a width no gate measured, or the ramp's narrow end lands at
 * a width nothing renders. All four now read `NARROW_VIEWPORT`; this file
 * holds them to it.
 */
import { describe, expect, it } from 'vitest'
import { fluid } from '../../../elements/chassis/scale.js'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../../elements/chassis/viewports.js'
import { RESPONSIVE_VIEWPORTS } from '../../../scripts/utils/archiver.js'
import { CRITIC_MOBILE_VIEWPORT } from '../../../scripts/utils/snapshot.js'
import { VIEWPORT_RUNGS } from '../../../scripts/utils/surface-gate.js'

const size = ({ width, height }) => ({ width, height })

describe('the phone the critics see', () => {
  it('is the rung the surface gate measures', () => {
    const rung = VIEWPORT_RUNGS.find((v) => v.name === 'mobile')
    expect(rung).toBeDefined()
    expect(CRITIC_MOBILE_VIEWPORT).toEqual({ width: rung.width, height: rung.height })
  })

  it('is NARROW_VIEWPORT', () => {
    expect(size(CRITIC_MOBILE_VIEWPORT)).toEqual(size(NARROW_VIEWPORT))
  })

  it('is a phone and not a narrow desktop', () => {
    // Under the narrowest tablet anyone measures at.
    expect(NARROW_VIEWPORT.width).toBeLessThan(480)
    expect(NARROW_VIEWPORT.width).toBeLessThan(WIDE_VIEWPORT.width)
  })
})

describe('everything that measures a phone reads NARROW_VIEWPORT', () => {
  it("the surface gate's mobile rung", () => {
    expect(size(VIEWPORT_RUNGS.find((v) => v.name === 'mobile'))).toEqual(size(NARROW_VIEWPORT))
  })

  it("the archiver's narrow viewport", () => {
    expect(size(RESPONSIVE_VIEWPORTS.find((v) => v.name === 'mobile'))).toEqual(
      size(NARROW_VIEWPORT)
    )
    expect(size(RESPONSIVE_VIEWPORTS.find((v) => v.name === 'desktop'))).toEqual(
      size(WIDE_VIEWPORT)
    )
  })

  it("the ramp's fluid minimum: a clamp's line meets its ends at the two widths", () => {
    const [, min, intercept, vw, max] = fluid('4rem', '6.5rem')
      .match(/^clamp\(([\d.]+)rem, (-?[\d.]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)$/)
      .map(Number)
    const lineAt = (px) => intercept + (vw / 100) * (px / 16)
    // `fluid()` rounds the intercept and slope to three places.
    expect(lineAt(NARROW_VIEWPORT.width)).toBeCloseTo(min, 2)
    expect(lineAt(WIDE_VIEWPORT.width)).toBeCloseTo(max, 2)
  })
})
