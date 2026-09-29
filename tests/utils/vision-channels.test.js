import { describe, expect, it } from 'vitest'
import { sawImages } from '../../scripts/utils/vision-channels.js'

describe('sawImages', () => {
  it('is true for the two channels that carried the images', () => {
    expect(sawImages('sdk-vision')).toBe(true)
    expect(sawImages('cli-vision')).toBe(true)
  })

  it.each([
    'sdk-vision-truncated',
    'cli-text-fallback',
    'cli-text-no-key',
    'cli-text-no-images',
    'fixture-replay',
    'unknown',
    undefined,
    null,
  ])('is false for %s', (channel) => {
    expect(sawImages(channel)).toBe(false)
  })
})
