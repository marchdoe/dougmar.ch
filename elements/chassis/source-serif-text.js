import { scaleSteps } from './scale.js'

/**
 * Single-family text serif. Source Serif 4 (Frank Grießhammer, Adobe) is a
 * genuine text serif with an optical-size axis — the register the catalog
 * lacked: its other serifs are display cuts (DM Serif, Fraunces) or
 * display-leaning (Spectral), none drawn first for running text. Here one
 * family carries the whole page: the display token and the body token both
 * point at Source Serif 4, and the browser's optical sizing picks the right
 * master at each size. buildGoogleFontsUrl merges the two tokens into one
 * css2 family request.
 *
 * Step table at Perfect 4th (1.333) — reading hierarchy, not poster
 * hierarchy, with body leading opened to 1.55 for long-measure text and a
 * rhythm of 24.8px falling out of it. The hero floor in scale.js still
 * carries the marquee to 64px-96px for the days a literary phrase leads.
 *
 * Weights verified on fonts.google.com/specimen: Source Serif 4 400/600/700
 * with italics (checked against the specimen page and a css2 request
 * returning 200).
 *
 * Off impeccable's reflex-reject list — Source Serif 4 does not appear on
 * it. Use for Broadsheet, Scroll, and Stack — text-led briefs where the
 * page should read like a book, not a poster.
 */

/** @type {import('./types.js').ChassisEntry} */
export const sourceSerifText = {
  id: 'source-serif-text',
  class: 'serif',
  name: 'Source Serif 4, alone',
  description:
    'Optically-sized text serif running display and body alike — literary, quiet, bookish.',
  moods: ['literary', 'quiet', 'bookish', 'warm', 'text-led'],
  archetypes: ['Broadsheet', 'Scroll', 'Stack'],

  fonts: {
    display: {
      family: 'Source Serif 4',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      weights: [600, 700],
      italics: false,
    },
    body: {
      family: 'Source Serif 4',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      weights: [400, 600],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.333, '1rem', {
      base: { lineHeight: 1.55 },
      md: { lineHeight: 1.45 },
      '2xl': { lineHeight: 1.12, tracking: '-0.01em' },
      '3xl': { lineHeight: 1.08, tracking: '-0.01em' },
      hero: { lineHeight: 1.05, tracking: '-0.005em' },
    }),
    weights: { light: 400, normal: 400, medium: 600, semibold: 600, bold: 700 },
  },
}
