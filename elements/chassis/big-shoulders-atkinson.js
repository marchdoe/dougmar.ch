import { scaleSteps } from './scale.js'

/**
 * Dramatic poster pairing. Big Shoulders Display is a condensed grotesque
 * with athletic energy — designed for signage, originally drawn for the
 * city of Chicago. Pairs with Atkinson Hyperlegible (Braille Institute,
 * optimized for low-vision readers — it has distinctive letterforms that
 * prevent character confusion, which makes it visually interesting at body).
 *
 * Step table at Golden ratio (1.618) — operatic hierarchy. Heading sizes
 * dwarf body; use only when the brief calls for visual drama. Condensed
 * caps are already narrow, so the display steps do NOT close: tracking sits
 * at zero from 2xl up, and the hero runs 0.9 leading for the stacked-
 * headline look the face was drawn for.
 *
 * Weights verified on fonts.google.com/specimen: Big Shoulders Display
 * 400/700/900, Atkinson Hyperlegible 400/700.
 *
 * Off impeccable's reflex-reject list. Use for Poster and Specimen archetypes,
 * especially with high-risk weights.
 */

/** @type {import('./types.js').ChassisEntry} */
export const bigShouldersAtkinson = {
  id: 'big-shoulders-atkinson',
  class: 'condensed',
  name: 'Big Shoulders Display + Atkinson Hyperlegible',
  description: 'Condensed signage display with hyperlegible body — dramatic, athletic, brand-loud.',
  moods: ['dramatic', 'poster', 'condensed', 'athletic', 'signage'],
  archetypes: ['Poster', 'Specimen'],

  fonts: {
    display: {
      family: 'Big Shoulders Display',
      fallbacks: ['Impact', 'Arial Narrow', 'sans-serif'],
      weights: [400, 700, 900],
      italics: false,
    },
    body: {
      family: 'Atkinson Hyperlegible',
      fallbacks: ['system-ui', '-apple-system', 'sans-serif'],
      weights: [400, 700],
      italics: true,
    },
  },

  type: {
    steps: scaleSteps(1.618, '1rem', {
      '2xl': { tracking: '-0.01em' },
      '3xl': { tracking: '-0.005em' },
      '4xl': { tracking: '-0.005em' },
      '5xl': { lineHeight: 0.9, tracking: '0' },
      hero: { lineHeight: 0.9, tracking: '0' },
    }),
    weights: { light: 400, normal: 400, medium: 700, semibold: 700, bold: 900 },
  },
}
