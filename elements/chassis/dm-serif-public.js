import { scaleSteps } from './scale.js'

/**
 * High-contrast didone pairing. DM Serif Display is a single-weight fashion
 * serif — thin hairlines against thick stems, drawn for headlines that want
 * to read as editorial or luxury rather than technical. Pairs with Public
 * Sans (USWDS), a sturdy, neutral body face that stays out of the way and
 * keeps the page from tipping into pure fashion-magazine pastiche.
 *
 * Step table at Golden ratio (1.618) — operatic hierarchy, the same
 * aggressive jump as big-shoulders-atkinson but through a serif instead of
 * a condensed grotesk. A didone must NOT be tracked tight: negative
 * spacing collides the hairline serifs. The display steps hold zero
 * tracking and the hero keeps 0.98 leading so ascenders and descenders
 * clear each other.
 *
 * Weights verified on fonts.google.com/specimen: DM Serif Display 400,
 * Public Sans 400/500/700.
 *
 * DM Serif Display appears on impeccable's reflex-reject list (a guard
 * against reaching for it by training-data habit in freeform design). That
 * guard doesn't apply to this catalog — it's a fixed menu, not a freeform
 * default. Note: playfair-outfit was a chassis retired from this catalog;
 * this is a distinct pairing (DM Serif Display + Public Sans, not Playfair
 * + Outfit) chosen specifically to avoid recreating it.
 */

/** @type {import('./types.js').ChassisEntry} */
export const dmSerifPublic = {
  id: 'dm-serif-public',
  class: 'serif',
  name: 'DM Serif Display + Public Sans',
  description:
    'High-contrast didone display with civic-neutral body — dramatic, fashion-editorial, declarative.',
  moods: ['dramatic', 'fashion', 'elegant', 'high-contrast', 'declarative'],
  archetypes: ['Poster', 'Specimen', 'Gallery Wall'],

  fonts: {
    display: {
      family: 'DM Serif Display',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      weights: [400],
      italics: true,
    },
    body: {
      family: 'Public Sans',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.618, '1rem', {
      '2xl': { tracking: '-0.005em' },
      '3xl': { tracking: '-0.005em' },
      '4xl': { tracking: '0' },
      '5xl': { tracking: '0' },
      hero: { lineHeight: 0.98, tracking: '0' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 700, bold: 700 },
  },
}
