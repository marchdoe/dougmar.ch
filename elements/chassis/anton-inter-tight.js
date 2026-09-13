import { scaleSteps } from './scale.js'

/**
 * Heavy-display poster pairing. Anton is a single-weight condensed display
 * sans (Vernon Adams, Google Fonts) — drawn for ad headlines, reads as
 * confident and tight. Pairs with Inter Tight (Rasmus Andersson, Google
 * Fonts), a workhorse sans optimized for screen text with a slightly
 * narrower advance than Inter classic — keeps body copy economical so
 * the display heads dominate.
 *
 * Step table at Perfect 5th (1.500) — dramatic hierarchy, comfortable home
 * for poster-scale type without crushing body legibility. Anton is drawn
 * tight already: the display steps do not close at all, and the hero opens
 * a hair so counters keep breathing at 120px.
 *
 * Weights verified on fonts.google.com/specimen: Anton 400,
 * Inter Tight 400/500/700.
 *
 * Off impeccable's reflex-reject list. Use for Poster, Specimen, and
 * Stack archetypes — anywhere the brief calls for headline-led drama.
 */

/** @type {import('./types.js').ChassisEntry} */
export const antonInterTight = {
  id: 'anton-inter-tight',
  class: 'condensed',
  name: 'Anton + Inter Tight',
  description: 'Condensed display heavy + workhorse sans body — confident, headline-led, modern.',
  moods: ['dramatic', 'poster', 'condensed', 'headline-led', 'modern'],
  archetypes: ['Poster', 'Specimen', 'Stack'],

  fonts: {
    display: {
      family: 'Anton',
      fallbacks: ['Impact', 'Arial Narrow', 'sans-serif'],
      weights: [400],
      italics: false,
    },
    body: {
      family: 'Inter Tight',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      '2xl': { tracking: '0' },
      '3xl': { tracking: '0' },
      '4xl': { tracking: '0' },
      '5xl': { tracking: '0' },
      hero: { lineHeight: 0.92, tracking: '0.005em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
