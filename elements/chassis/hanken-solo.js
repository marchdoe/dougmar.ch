import { scaleSteps } from './scale.js'

/**
 * Single-family humanist sans. Hanken Grotesk (Hanken Design Co.) is a
 * humanist grotesk in the Frutiger line — open apertures, warm without
 * being rounded — and it runs alone here at three weights: 400 for body,
 * 600 for structure, 800 for display. The brand reference's own pairing
 * rule says a single well-chosen family with committed weight contrast is
 * stronger than a timid display+body pair; this is the catalog's proof of
 * it, and its first single-family sans (space-mono-archivo still pairs).
 * buildGoogleFontsUrl merges the two tokens into one css2 family request.
 *
 * Step table at Augmented 4th (1.414) — hierarchy comes from weight
 * contrast as much as size, so the ratio stays out of poster territory.
 * Grotesks close normally at display size; the hero takes -0.015em.
 *
 * Weights verified on fonts.google.com/specimen: Hanken Grotesk
 * 400/600/800 with italics (checked against the specimen page and a css2
 * request returning 200).
 *
 * Off impeccable's reflex-reject list — Hanken Grotesk does not appear on
 * it. Use for Scroll, Stack, and Index — quiet, product-adjacent briefs
 * where one committed voice beats a pairing.
 */

/** @type {import('./types.js').ChassisEntry} */
export const hankenSolo = {
  id: 'hanken-solo',
  class: 'grotesque',
  name: 'Hanken Grotesk, alone',
  description: 'One humanist grotesk at three weights — single-voice, quiet, committed.',
  moods: ['humanist', 'single-voice', 'quiet', 'warm', 'understated'],
  archetypes: ['Scroll', 'Stack', 'Index'],

  fonts: {
    display: {
      family: 'Hanken Grotesk',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [800],
      italics: false,
    },
    body: {
      family: 'Hanken Grotesk',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 600],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.414, '1rem', {
      '2xl': { tracking: '-0.015em' },
      '3xl': { tracking: '-0.015em' },
      hero: { lineHeight: 0.95, tracking: '-0.015em' },
    }),
    weights: { light: 400, normal: 400, medium: 600, semibold: 600, bold: 800 },
  },
}
