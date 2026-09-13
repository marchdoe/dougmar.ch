import { scaleSteps } from './scale.js'

/**
 * Modern expressive pairing. Bricolage Grotesque is a variable display face
 * with deliberate quirk — it tightens at large sizes and softens at body.
 * Pairs with Manrope's humanist sans for body — readable, warm, slightly
 * informal without being childlike.
 *
 * Step table at Perfect 5th (1.500) — dramatic hierarchy jumps, heading-led
 * layouts where the typography is the visual hierarchy. Bricolage already
 * tightens optically at display sizes, so the big steps close a touch more
 * than the default and the hero sits at 0.92 leading.
 *
 * Weights verified on fonts.google.com/specimen: Bricolage Grotesque
 * 400/600/800, Manrope 400/500/700.
 *
 * Off impeccable's reflex-reject list. Use for brand-register days that
 * need expressive voice — Poster, Stack, Scroll archetypes especially.
 */

/** @type {import('./types.js').ChassisEntry} */
export const bricolageManrope = {
  id: 'bricolage-manrope',
  class: 'grotesque',
  name: 'Bricolage Grotesque + Manrope',
  description: 'Expressive variable display with humanist body — modern, warm, brand-driven.',
  moods: ['expressive', 'modern', 'brand-driven', 'warm', 'distinctive'],
  archetypes: ['Poster', 'Stack', 'Scroll'],

  fonts: {
    display: {
      family: 'Bricolage Grotesque',
      fallbacks: ['Georgia', 'serif'],
      weights: [400, 600, 800],
      italics: false,
    },
    body: {
      family: 'Manrope',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      hero: { lineHeight: 0.92 },
      '2xl': { tracking: '-0.02em' },
      '3xl': { tracking: '-0.025em' },
    }),
    weights: { light: 400, normal: 400, medium: 500, semibold: 600, bold: 800 },
  },
}
