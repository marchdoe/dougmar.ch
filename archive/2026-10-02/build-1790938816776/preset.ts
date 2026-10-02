import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      margin: '0',
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        green: {
          50: { value: '#e3fbf1' },
          100: { value: '#c0f6de' },
          200: { value: '#86edc2' },
          300: { value: '#4ce2a6' },
          400: { value: '#1fd891' },
          500: { value: '#16bd7f' },
          600: { value: '#109866' },
          700: { value: '#0d7650' },
          800: { value: '#0a5a3d' },
          900: { value: '#073d2a' },
        },
        neutral: {
          50: { value: '#eef4f0' },
          100: { value: '#dde9e2' },
          200: { value: '#bdd1c6' },
          300: { value: '#93ab9f' },
          400: { value: '#6b857a' },
          500: { value: '#4d645a' },
          600: { value: '#394d44' },
          700: { value: '#293932' },
          800: { value: '#182621' },
          900: { value: '#0c1611' },
        },
        void: {
          alt: { value: '#10201a' },
          surface: { value: '#16271f' },
          field: { value: '#0f2e22' },
          fieldBorder: { value: '#1d4a37' },
          fieldInk: { value: '#d9f6e9' },
          fieldInkMuted: { value: '#83c6a7' },
          accentText: { value: '#06130d' },
          accentAlt: { value: '#5ce6b0' },
          textMuted: { value: '#9fb6aa' },
          textFaint: { value: '#80978b' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '4px' },
        lg: { value: '10px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.neutral.900}' } },
        bgAlt: { value: { base: '{colors.void.alt}' } },
        surface: { value: { base: '{colors.void.surface}' } },
        text: { value: { base: '{colors.neutral.50}' } },
        textMuted: { value: { base: '{colors.void.textMuted}' } },
        textFaint: { value: { base: '{colors.void.textFaint}' } },
        accent: { value: { base: '{colors.green.400}' } },
        accentText: { value: { base: '{colors.void.accentText}' } },
        accentAlt: { value: { base: '{colors.void.accentAlt}' } },
        border: { value: { base: '{colors.neutral.700}' } },
        borderStrong: { value: { base: '{colors.neutral.500}' } },
        field: { value: { base: '{colors.void.field}' } },
        fieldInk: { value: { base: '{colors.void.fieldInk}' } },
        fieldInkMuted: { value: { base: '{colors.void.fieldInkMuted}' } },
        fieldBorder: { value: { base: '{colors.void.fieldBorder}' } },
      },
    },
  },
})