import { scaleSteps } from './scale.js'

/**
 * Contemporary slab pairing with real weight range. Bitter (Sol Matas,
 * Huerta Tipográfica) is a slab drawn for screens, and unlike Zilla it
 * carries genuine heavy cuts — at 900 it holds a headline the way a poster
 * slab should, without the low-contrast lightness that keeps zilla-worksans
 * in the editorial register. Pairs with Mulish, a rounded humanist sans
 * whose softness keeps the slab's geometry from reading cold.
 *
 * Step table at Augmented 4th (1.414) — between the editorial 1.333 pair
 * and the poster 1.5s: enough jump for a slab headline to carry a page,
 * restrained enough for dense index layouts underneath it. Slabs carry
 * weight in their serifs, so the display steps close only lightly.
 *
 * Weights verified on fonts.google.com/specimen: Bitter 500/700/900,
 * Mulish 400/500/700 with italics (both checked against the specimen page
 * and a css2 request returning 200).
 *
 * Off impeccable's reflex-reject list — neither Bitter nor Mulish appear
 * on it. Use for Broadsheet, Index, and Split — structural briefs that
 * want more muscle than zilla-worksans without going full poster.
 */

/** @type {import('./types.js').ChassisEntry} */
export const bitterMulish = {
  id: 'bitter-mulish',
  class: 'slab',
  name: 'Bitter + Mulish',
  description: 'Screen slab with real heavy cuts + soft humanist body — sturdy, warm, weighted.',
  moods: ['slab', 'grounded', 'sturdy', 'editorial', 'contemporary'],
  archetypes: ['Broadsheet', 'Index', 'Split'],

  fonts: {
    display: {
      family: 'Bitter',
      fallbacks: ['Georgia', 'serif'],
      weights: [500, 700, 900],
      italics: false,
    },
    body: {
      family: 'Mulish',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.414, '1rem', {
      '2xl': { tracking: '-0.01em' },
      '3xl': { tracking: '-0.01em' },
      hero: { lineHeight: 0.95, tracking: '-0.01em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 900 },
  },
}
