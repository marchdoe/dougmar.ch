import { fluid, scaleSteps } from './scale.js'

/**
 * Wide grotesk pairing with a real italic. Anybody (Tyler Finck, ETC) is a
 * squarish grotesk drawn wide, with genuine italics across its weight range
 * — the register the catalog lacked: Unbounded is wide but has no italic,
 * and every condensed chassis leans the other way entirely. Pairs with
 * Libre Franklin, the open-source Franklin Gothic revival, whose own
 * italics let the body echo the display's slant instead of faking it.
 *
 * Step table at Augmented 4th (1.414) — display voice a register below the
 * poster chassis, with the hero widened past the default floor to
 * 72px-120px so the wide proportions still read as a statement at marquee.
 * Wide faces need almost no closing; the display steps take -0.005em.
 *
 * Weights verified on fonts.google.com/specimen: Anybody 400/700/900 with
 * italics, Libre Franklin 400/500/700 with italics (both checked against
 * the specimen page and a css2 request returning 200).
 *
 * Off impeccable's reflex-reject list — neither Anybody nor Libre Franklin
 * appear on it. Use for Poster, Split, and Stack — briefs that want
 * confident width with an italic voice for emphasis and pull-quotes.
 */

/** @type {import('./types.js').ChassisEntry} */
export const anybodyFranklin = {
  id: 'anybody-franklin',
  class: 'grotesque',
  name: 'Anybody + Libre Franklin',
  description:
    'Wide squarish grotesk with true italics + Franklin Gothic body — broad, sporty, emphatic.',
  moods: ['wide', 'sporty', 'confident', 'italic-forward', 'modern'],
  archetypes: ['Poster', 'Split', 'Stack'],

  fonts: {
    display: {
      family: 'Anybody',
      fallbacks: ['Arial Black', 'Arial', 'sans-serif'],
      weights: [400, 700, 900],
      italics: true,
    },
    body: {
      family: 'Libre Franklin',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.414, '1rem', {
      '2xl': { tracking: '-0.005em' },
      '3xl': { tracking: '-0.005em' },
      '4xl': { tracking: '-0.005em' },
      '5xl': { tracking: '-0.005em' },
      hero: { size: fluid('4.5rem', '7.5rem'), lineHeight: 0.92, tracking: '-0.005em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 900 },
  },
}
