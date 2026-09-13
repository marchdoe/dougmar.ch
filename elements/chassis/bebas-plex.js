import { scaleSteps } from './scale.js'

/**
 * Editorial-poster pairing. Bebas Neue is a tall, condensed display sans
 * (Ryoichi Tsunekawa, Google Fonts) — narrower and more editorial than
 * Anton, with a tabular feel that suits dense list/index layouts. Pairs
 * with IBM Plex Sans (IBM/Bold Monkeys, Google Fonts), a humanist
 * workhorse with mechanical texture and a wide weight range.
 *
 * Step table at Perfect 5th (1.500) — same dramatic hierarchy as
 * anton-inter-tight, but a different mood: editorial / catalog / index
 * vs. poster / signage. Bebas is all-caps and very narrow, and caps need
 * air: the display steps open rather than close, with the hero at a full
 * 0.02em.
 *
 * Weights verified on fonts.google.com/specimen: Bebas Neue 400,
 * IBM Plex Sans 400/500/700.
 *
 * Off impeccable's reflex-reject list. Use for Specimen, Index, and
 * Split archetypes — anywhere the brief calls for editorial weight at
 * poster scale.
 */

/** @type {import('./types.js').ChassisEntry} */
export const bebasPlex = {
  id: 'bebas-plex',
  class: 'condensed',
  name: 'Bebas Neue + IBM Plex Sans',
  description:
    'Condensed editorial display + humanist workhorse body — editorial, catalog, declarative.',
  moods: ['editorial', 'catalog', 'declarative', 'condensed', 'humanist'],
  archetypes: ['Specimen', 'Index', 'Split'],

  fonts: {
    display: {
      family: 'Bebas Neue',
      fallbacks: ['Oswald', 'Impact', 'sans-serif'],
      weights: [400],
      italics: false,
    },
    body: {
      family: 'IBM Plex Sans',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      '2xl': { tracking: '0.01em' },
      '3xl': { tracking: '0.015em' },
      '4xl': { tracking: '0.015em' },
      '5xl': { tracking: '0.015em' },
      hero: { lineHeight: 0.9, tracking: '0.02em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
