import { scaleSteps } from './scale.js'

/**
 * Editorial slab pairing. Spectral is a transitional serif with low contrast
 * and slab-leaning details — it reads as literary without the predictability
 * of Lora or Playfair. Albert Sans is a clean humanist body font that stays
 * out of the way.
 *
 * Step table at Perfect 4th (1.333) — strong hierarchy without operatic
 * drama, suited to text-dense layouts where reading rhythm matters. A serif
 * keeps more air at display sizes than a grotesk, so the big steps run
 * looser leading and close only gently; the hero floor in scale.js lifts
 * the marquee to a real 64px-to-96px range (its 2xl alone sat at 50.5px,
 * the undershoot #257 found).
 *
 * Weights verified on fonts.google.com/specimen: Spectral 400/500/700,
 * Albert Sans 400/500/600.
 *
 * Off impeccable's reflex-reject list. Use for editorial, literary,
 * considered briefs — Broadsheet, Stack, Scroll, Gallery Wall.
 */

/** @type {import('./types.js').ChassisEntry} */
export const spectralAlbert = {
  id: 'spectral-albert',
  class: 'serif',
  name: 'Spectral + Albert Sans',
  description: 'Transitional slab serif with humanist body — editorial, literary, considered.',
  moods: ['editorial', 'literary', 'considered', 'distinctive', 'reflective'],
  archetypes: ['Broadsheet', 'Stack', 'Scroll', 'Gallery Wall'],

  fonts: {
    display: {
      family: 'Spectral',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      weights: [400, 500, 700],
      italics: true,
    },
    body: {
      family: 'Albert Sans',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 600],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.333, '1rem', {
      '2xl': { lineHeight: 1.15, tracking: '-0.01em' },
      '3xl': { lineHeight: 1.1, tracking: '-0.01em' },
      hero: { lineHeight: 1.05, tracking: '-0.01em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
}
