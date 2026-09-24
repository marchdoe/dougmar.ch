import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
    },
    '*': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover, a:focus-visible': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    'blockquote, figure': {
      margin: 0,
    },
  },
  conditions: {
    _light: '[data-color-mode=light] &',
    _dark: '[data-color-mode=dark] &',
    _hover: '&:is(:hover, :focus-visible)',
  },
  theme: {
    tokens: {
      colors: {
        cobalt: {
          50: { value: '#eef4fb' },
          100: { value: '#d9e6f6' },
          200: { value: '#b3ccec' },
          300: { value: '#85abe0' },
          400: { value: '#5285d1' },
          500: { value: '#2f66c4' },
          600: { value: '#1f4fa8' },
          700: { value: '#1a4088' },
          800: { value: '#17356d' },
          900: { value: '#132a54' },
        },
        slate: {
          50: { value: '#f7f9fc' },
          100: { value: '#eef2f8' },
          200: { value: '#dde4ee' },
          300: { value: '#c3cddb' },
          400: { value: '#9aa7ba' },
          500: { value: '#6f7c90' },
          600: { value: '#515d6f' },
          700: { value: '#3b4453' },
          800: { value: '#262d38' },
          900: { value: '#171c24' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '4px' },
        lg: { value: '8px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.cobalt.50}' } },
        bgAlt: { value: { base: '{colors.cobalt.100}' } },
        surface: { value: { base: '{colors.slate.50}' } },
        text: { value: { base: '{colors.slate.900}' } },
        textMuted: { value: { base: '{colors.slate.700}' } },
        textFaint: { value: { base: '{colors.slate.600}' } },
        accent: { value: { base: '{colors.cobalt.600}' } },
        accentText: { value: { base: '#ffffff' } },
        accentAlt: { value: { base: '{colors.cobalt.400}' } },
        border: { value: { base: '{colors.slate.300}' } },
        borderStrong: { value: { base: '{colors.slate.400}' } },
        field: { value: { base: '{colors.cobalt.800}' } },
        fieldInk: { value: { base: '{colors.cobalt.50}' } },
        fieldInkMuted: { value: { base: '#a9c4e8' } },
        fieldBorder: { value: { base: '#2f5490' } },
      },
    },
  },
})