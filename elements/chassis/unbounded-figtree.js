import { scaleSteps } from './scale.js'

/**
 * Wide/expanded grotesk pairing. Unbounded is a blocky, geometric variable
 * display face drawn WIDE rather than condensed — the opposite proportion
 * statement from the catalog's condensed-caps chassis. Pairs with
 * Figtree, a warm neutral grotesk for body, so the wide display headlines
 * don't fight a competing personality underneath them.
 *
 * Step table at Perfect 5th (1.500) — display-grade, marquee-capable. A
 * face this wide is already making a proportion statement; over-closing it
 * would undo the point, so the display steps take only a light -0.01em and
 * the hero sits at 0.95 leading.
 *
 * Weights verified on fonts.google.com/specimen: Unbounded 400/700/900,
 * Figtree 400/500/700.
 *
 * Off impeccable's reflex-reject list — neither Unbounded nor Figtree
 * appear on it. Use for Poster, Specimen, and Gallery Wall — anywhere the
 * brief wants loud, geometric confidence that isn't condensed.
 */

/** @type {import('./types.js').ChassisEntry} */
export const unboundedFigtree = {
  id: 'unbounded-figtree',
  class: 'display',
  name: 'Unbounded + Figtree',
  description:
    'Blocky, wide geometric display with warm neutral grotesk body — expanded, confident, modern-loud.',
  moods: ['geometric', 'expanded', 'blocky', 'confident', 'modern'],
  archetypes: ['Poster', 'Specimen', 'Gallery Wall'],

  fonts: {
    display: {
      family: 'Unbounded',
      fallbacks: ['Arial', 'sans-serif'],
      weights: [400, 700, 900],
      italics: false,
    },
    body: {
      family: 'Figtree',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      '2xl': { tracking: '-0.01em' },
      '3xl': { tracking: '-0.01em' },
      '4xl': { tracking: '-0.01em' },
      '5xl': { tracking: '-0.01em' },
      hero: { tracking: '-0.01em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 900 },
  },
}
