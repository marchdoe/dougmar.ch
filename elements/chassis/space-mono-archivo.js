import { scaleSteps } from './scale.js'

/**
 * Mono-display pairing. Space Mono is a retro-futurist monospace pushed up
 * to display duty — quirky, technical, terminal-adjacent, unlike anything
 * else in the catalog (every other chassis pairs a proportional display
 * face). Pairs with Archivo, a neutral grotesk body, so the mono voice
 * stays confined to headlines and doesn't make body copy tedious to read.
 *
 * Step table at Perfect 5th (1.500) — display-grade, marquee-capable. A
 * monospace sets wide by construction, so the display steps close harder
 * than any other chassis: the fixed advance leaves visible air between
 * glyphs that negative tracking claws back at poster sizes.
 *
 * Weights verified on fonts.google.com/specimen: Space Mono 400/700,
 * Archivo 400/500/700.
 *
 * Space Mono appears on impeccable's reflex-reject list (a guard against
 * reaching for it by training-data habit in freeform design). That guard
 * doesn't apply here — this catalog is a fixed menu the Art Director picks
 * from, not a freeform default. Use for Specimen, Index, and Split — the
 * archetypes that already read as technical/precise and can carry a
 * monospace display without it feeling like a costume.
 */

/** @type {import('./types.js').ChassisEntry} */
export const spaceMonoArchivo = {
  id: 'space-mono-archivo',
  class: 'mono',
  name: 'Space Mono + Archivo',
  description:
    'Retro-futurist monospace display with neutral grotesk body — technical, precise, terminal-adjacent.',
  moods: ['technical', 'retro-futurist', 'terminal', 'precise', 'quirky'],
  archetypes: ['Specimen', 'Index', 'Split'],

  fonts: {
    display: {
      family: 'Space Mono',
      fallbacks: ['SFMono-Regular', 'Menlo', 'monospace'],
      weights: [400, 700],
      italics: true,
    },
    body: {
      family: 'Archivo',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      '2xl': { tracking: '-0.02em' },
      '3xl': { tracking: '-0.025em' },
      '4xl': { tracking: '-0.03em' },
      '5xl': { tracking: '-0.03em' },
      hero: { lineHeight: 1, tracking: '-0.03em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
