import { describe, expect, it } from 'vitest'
import { heroPxAt, pickShippedRound, roundShortfall } from '../../scripts/utils/mockup-rounds.js'

const measured = (canvas_utilization, color_coverage, hero_px) => ({
  canvas_utilization,
  color_coverage,
  hero_px,
})
const rounds = (...triples) =>
  triples.map(([c, k, h], round) => ({ round, measured: measured(c, k, h) }))

describe('heroPxAt', () => {
  it('resolves a clamp at 1440 to its preferred value inside the bounds', () => {
    expect(heroPxAt('clamp(56px, 8.5vw, 136px)')).toBeCloseTo(122.4, 5)
  })

  it('caps at the maximum and floors at the minimum', () => {
    expect(heroPxAt('clamp(140px, 24vw, 340px)')).toBe(340)
    expect(heroPxAt('clamp(200px, 5vw, 340px)')).toBe(200)
  })

  it('reads a bare length in px, vw or rem', () => {
    expect(heroPxAt('96px')).toBe(96)
    expect(heroPxAt('12vw')).toBeCloseTo(172.8, 5)
    expect(heroPxAt('6rem')).toBe(96)
  })

  it('returns null for a form it does not read', () => {
    expect(heroPxAt('calc(4vw + 20px)')).toBeNull()
    expect(heroPxAt('clamp(1rem, 2vw)')).toBeNull()
    expect(heroPxAt(null)).toBeNull()
    expect(heroPxAt(undefined)).toBeNull()
  })
})

describe('roundShortfall', () => {
  const declared = {
    canvas_utilization_min: 80,
    color_coverage_min: 60,
    hero_scale: 'clamp(100px, 10vw, 200px)',
  }

  it('is zero when every floor is met and the hero is the declared size', () => {
    expect(roundShortfall(measured(90, 70, 144), declared)).toEqual({
      canvas: 0,
      colour: 0,
      hero: 0,
      total: 0,
    })
  })

  it('sums the points under each floor and the percent the hero is off', () => {
    // 10 under on canvas, 5 under on colour, hero 108 against 144 is 25% off.
    expect(roundShortfall(measured(70, 55, 108), declared)).toEqual({
      canvas: 10,
      colour: 5,
      hero: 25,
      total: 40,
    })
  })

  it('counts a hero that overshoots as well as one that undershoots', () => {
    expect(roundShortfall(measured(90, 70, 216), declared).hero).toBe(50)
  })

  it('does not reward clearing a floor by a wide margin', () => {
    expect(roundShortfall(measured(100, 100, 144), declared).total).toBe(0)
  })

  it('leaves out anything that was not declared', () => {
    expect(roundShortfall(measured(10, 10, 10), null).total).toBe(0)
    expect(roundShortfall(measured(10, 10, 10), { canvas_utilization_min: 50 })).toMatchObject({
      canvas: 40,
      colour: 0,
      hero: 0,
    })
  })
})

describe('pickShippedRound', () => {
  it('returns null when nothing was measured', () => {
    expect(pickShippedRound([], { canvas_utilization_min: 80 })).toBeNull()
    expect(pickShippedRound(null, { canvas_utilization_min: 80 })).toBeNull()
    expect(pickShippedRound([{ round: 0, measured: null }], {})).toBeNull()
  })

  it('takes the later round on a tie', () => {
    const pick = pickShippedRound(rounds([90, 70, 144], [95, 80, 144], [85, 65, 144]), {
      canvas_utilization_min: 80,
      color_coverage_min: 60,
      hero_scale: '144px',
    })
    expect(pick.round).toBe(2)
    expect(pick.latest).toBe(2)
  })

  it('takes the later round when nothing was declared', () => {
    expect(pickShippedRound(rounds([10, 10, 10], [20, 20, 20]), null).round).toBe(1)
  })

  it('names the round, the latest and the numbers behind the choice', () => {
    const pick = pickShippedRound(rounds([90, 70, 144], [40, 70, 144], [30, 70, 144]), {
      canvas_utilization_min: 80,
      color_coverage_min: 60,
      hero_scale: '144px',
    })
    expect(pick.round).toBe(0)
    expect(pick.latest).toBe(2)
    expect(pick.shortfalls.map((s) => [s.round, s.total])).toEqual([
      [0, 0],
      [1, 40],
      [2, 50],
    ])
    expect(pick.reason).toContain('round 0 misses its floors by 0 points against 50 for round 2')
  })

  // The five nights in #573, from each night's mockup-measurables.json: the
  // declared floors and the numbers measured for every round. The last round
  // measured worse than an earlier one on each.
  describe('the nights where the last round was not the best', () => {
    const nights = [
      {
        night: '2026-09-11',
        declared: {
          canvas_utilization_min: 76,
          color_coverage_min: 40,
          hero_scale: 'clamp(56px, 8.5vw, 122px)',
        },
        rounds: rounds([52.1, 40.2, 44], [61.9, 59.4, 56], [52.1, 41.5, 56]),
        ships: 1,
      },
      {
        night: '2026-09-13',
        declared: {
          canvas_utilization_min: 72,
          color_coverage_min: 60,
          hero_scale: 'clamp(110px, 15vw, 200px)',
        },
        rounds: rounds([61.8, 61.4, 200], [67.9, 67.3, 200], [65.6, 65.3, 200]),
        ships: 1,
      },
      {
        night: '2026-09-15',
        declared: {
          canvas_utilization_min: 78,
          color_coverage_min: 40,
          hero_scale: 'clamp(96px, 22vw, 300px)',
        },
        rounds: rounds([58.8, 28.8, 300], [100, 79.1, 300], [61.5, 45.1, 300]),
        ships: 1,
      },
      {
        // Round 0 measured 100 and 100 and was revised for a missing mark.
        // Round 1 is over the canvas floor too, but its hero measured 520px
        // against a declared 340, so round 0 is the one with no shortfall.
        night: '2026-09-16',
        declared: {
          canvas_utilization_min: 82,
          color_coverage_min: 78,
          hero_scale: 'clamp(140px, 24vw, 340px)',
        },
        rounds: rounds([100, 100, 340], [94.4, 100, 520], [38.6, 97.8, 340]),
        ships: 0,
      },
      {
        night: '2026-09-18',
        declared: {
          canvas_utilization_min: 80,
          color_coverage_min: 55,
          hero_scale: 'clamp(72px, 9vw, 122px)',
        },
        rounds: rounds([67.5, 61.9, 122], [76.4, 73.9, 122], [68.9, 66.5, 122]),
        ships: 1,
      },
    ]

    for (const { night, declared, rounds: measuredRounds, ships } of nights) {
      it(`${night} ships round ${ships}`, () => {
        const pick = pickShippedRound(measuredRounds, declared)
        expect(pick.round).toBe(ships)
        expect(pick.latest).toBe(2)
      })
    }

    it('2026-09-16 scores round 1 by its hero, which the canvas number cannot see', () => {
      const declared = nights[3].declared
      const [r0, r1, r2] = nights[3].rounds.map((r) => roundShortfall(r.measured, declared))
      expect(r0.total).toBe(0)
      expect(r1).toMatchObject({ canvas: 0, colour: 0, hero: 52.9 })
      expect(r2).toMatchObject({ canvas: 43.4, colour: 0, hero: 0 })
    })
  })
})
