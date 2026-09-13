import { scaleSteps } from './scale.js'

/**
 * Fat-face poster pairing. Alfa Slab One (JM Solé) is an ultra-bold
 * fatface slab — circus poster, fruit-crate label, wood type — genuine
 * character for poster days that is not condensed caps: where the
 * condensed chassis narrow under pressure, Alfa is all girth and rounded
 * serifs. Pairs with Rubik, whose slightly rounded corners pick up Alfa's
 * warmth at body size without competing.
 *
 * Step table at Golden ratio (1.618) — operatic, poster-first. A fatface's
 * counters are already nearly closed, so it must not be tracked tight: the
 * display steps hold zero and the hero opens a hair at 0.005em with 0.95
 * leading.
 *
 * Weights verified on fonts.google.com/specimen: Alfa Slab One 400,
 * Rubik 400/500/700 with italics (both checked against the specimen page
 * and a css2 request returning 200).
 *
 * Off impeccable's reflex-reject list — neither Alfa Slab One nor Rubik
 * appear on it. Use for Poster, Specimen, and Gallery Wall — loud days
 * that want carnival warmth instead of signage shout.
 */

/** @type {import('./types.js').ChassisEntry} */
export const alfaRubik = {
  id: 'alfa-rubik',
  class: 'display',
  name: 'Alfa Slab One + Rubik',
  description: 'Ultra-bold fatface slab with rounded grotesk body — carnival-loud, warm, physical.',
  moods: ['fat', 'playful', 'carnival', 'loud', 'rounded'],
  archetypes: ['Poster', 'Specimen', 'Gallery Wall'],

  fonts: {
    display: {
      family: 'Alfa Slab One',
      fallbacks: ['Rockwell', 'Georgia', 'serif'],
      weights: [400],
      italics: false,
    },
    body: {
      family: 'Rubik',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.618, '1rem', {
      '2xl': { tracking: '0' },
      '3xl': { tracking: '0' },
      '4xl': { tracking: '0' },
      '5xl': { tracking: '0' },
      hero: { lineHeight: 0.95, tracking: '0.005em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
