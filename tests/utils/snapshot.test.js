import { describe, it, expect } from 'vitest'
import {
  computeDownscaleDimensions,
  computePhoneFilmstripFolds,
  phoneFilmstripMoreLabel,
} from '../../scripts/utils/snapshot.js'

describe('computeDownscaleDimensions', () => {
  it('scales a full-res capture down to the target width, preserving aspect ratio', () => {
    expect(computeDownscaleDimensions(1280, 900, 1024)).toEqual({ width: 1024, height: 720 })
  })

  it('scales a wider mockup capture down proportionally', () => {
    expect(computeDownscaleDimensions(1440, 900, 1024)).toEqual({ width: 1024, height: 640 })
  })

  it('never upscales a source already narrower than the target', () => {
    expect(computeDownscaleDimensions(800, 600, 1024)).toEqual({ width: 800, height: 600 })
  })

  it('defaults the target width to the critic-bound ceiling (1024)', () => {
    expect(computeDownscaleDimensions(1280, 900)).toEqual({ width: 1024, height: 720 })
  })
})

describe('computePhoneFilmstripFolds', () => {
  it('a page under one fold tall is one fold, none hidden', () => {
    expect(computePhoneFilmstripFolds(500)).toEqual({ totalFolds: 1, shownFolds: 1, moreFolds: 0 })
  })

  it('a page exactly one fold tall is one fold, none hidden', () => {
    expect(computePhoneFilmstripFolds(640)).toEqual({ totalFolds: 1, shownFolds: 1, moreFolds: 0 })
  })

  it('one CSS pixel past a fold starts a second fold', () => {
    expect(computePhoneFilmstripFolds(641)).toEqual({ totalFolds: 2, shownFolds: 2, moreFolds: 0 })
  })

  it('a page needing seven folds shows six and hides one', () => {
    expect(computePhoneFilmstripFolds(3841)).toEqual({
      totalFolds: 7,
      shownFolds: 6,
      moreFolds: 1,
    })
  })

  it('a page needing nine folds shows six and hides three', () => {
    expect(computePhoneFilmstripFolds(5486)).toEqual({
      totalFolds: 9,
      shownFolds: 6,
      moreFolds: 3,
    })
  })
})

describe('phoneFilmstripMoreLabel', () => {
  it('is null when every fold is already shown', () => {
    expect(phoneFilmstripMoreLabel(0)).toBeNull()
  })

  it('is singular for exactly one hidden fold', () => {
    expect(phoneFilmstripMoreLabel(1)).toBe('1 more fold not shown')
  })

  it('is plural for more than one hidden fold', () => {
    expect(phoneFilmstripMoreLabel(3)).toBe('3 more folds not shown')
  })
})
