import { scaleSteps } from './scale.js'

/**
 * Fat, soft display serif pairing. Fraunces is a variable "wonky" serif with
 * high-contrast optical sizing — at heavy weights it reads warm and tactile
 * rather than formal, closer to a hand-inked headline than a book face.
 * Pairs with Karla, a clean humanist grotesk for body — keeps the softness
 * of the display from tipping into whimsy.
 *
 * Step table at Perfect 5th (1.500) — display-grade, marquee-capable.
 * Fraunces' round, generous letterforms tolerate tight leading: the hero
 * runs 0.9 with only moderate closing, so the wonk stays visible instead of
 * colliding.
 *
 * Weights verified on fonts.google.com/specimen: Fraunces 300/400/600/900,
 * Karla 400/500/700.
 *
 * Fraunces appears on impeccable's reflex-reject list (a guard against
 * defaulting into it in freeform generative design). That guard doesn't
 * apply here — this catalog is a fixed, hand-curated menu the Art Director
 * picks FROM, not a freeform choice a model reaches for by habit. Use for
 * Gallery Wall, Stack, and Broadsheet — anywhere the brief wants warmth
 * without losing display-scale confidence.
 */

/** @type {import('./types.js').ChassisEntry} */
export const fraucesKarla = {
  id: 'fraunces-karla',
  class: 'serif',
  name: 'Fraunces + Karla',
  description:
    'Fat, soft variable display serif with humanist grotesk body — warm, tactile, generous.',
  moods: ['warm', 'soft', 'tactile', 'editorial', 'friendly'],
  archetypes: ['Gallery Wall', 'Stack', 'Broadsheet'],

  fonts: {
    display: {
      family: 'Fraunces',
      fallbacks: ['Georgia', 'serif'],
      weights: [300, 400, 600, 900],
      italics: true,
    },
    body: {
      family: 'Karla',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 500, 700],
      italics: false,
    },
  },

  type: {
    steps: scaleSteps(1.5, '1rem', {
      '2xl': { tracking: '-0.01em' },
      '3xl': { tracking: '-0.015em' },
      hero: { lineHeight: 0.9, tracking: '-0.015em' },
    }),
    weights: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 900 },
  },
}
