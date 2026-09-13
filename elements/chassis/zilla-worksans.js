import { scaleSteps } from './scale.js'

/**
 * Editorial slab pairing. Zilla Slab is a sturdy, low-contrast slab serif
 * (Mozilla, designed for reading at both text and display sizes) — it reads
 * confident and grounded without the signage energy of a condensed grotesk.
 * Pairs with Work Sans, a humanist sans body drawn for screen legibility.
 *
 * Step table at Perfect 4th (1.333) — editorial hierarchy, not operatic.
 * Sits alongside spectral-albert as a text-dense chassis; slab serifs carry
 * more visual weight than their size suggests, so the display steps keep a
 * little extra leading and close only slightly. The hero floor in scale.js
 * lifts the marquee to a real 64px-to-96px range (its 2xl alone sat at
 * 50.5px, the undershoot #257 found).
 *
 * Weights verified on fonts.google.com/specimen: Zilla Slab 400/500/700,
 * Work Sans 400/500/700.
 *
 * Off impeccable's reflex-reject list — neither Zilla Slab nor Work Sans
 * appear on it. Use for Broadsheet, Index, and Stack archetypes — anywhere
 * the brief wants grounded, structural confidence over poster drama.
 */

/** @type {import('./types.js').ChassisEntry} */
export const zillaWorksans = {
  id: 'zilla-worksans',
  class: 'slab',
  name: 'Zilla Slab + Work Sans',
  description: 'Sturdy low-contrast slab serif with humanist body — confident, structural, civic.',
  moods: ['confident', 'structural', 'civic', 'editorial', 'grounded'],
  archetypes: ['Broadsheet', 'Index', 'Stack'],

  fonts: {
    display: {
      family: 'Zilla Slab',
      fallbacks: ['Georgia', 'serif'],
      weights: [400, 500, 700],
      italics: true,
    },
    body: {
      family: 'Work Sans',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.333, '1rem', {
      '2xl': { lineHeight: 1.15, tracking: '-0.01em' },
      '3xl': { lineHeight: 1.1, tracking: '-0.01em' },
      hero: { lineHeight: 1.02, tracking: '-0.005em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
