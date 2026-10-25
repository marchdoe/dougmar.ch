import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': { boxSizing: 'border-box' },
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      fontKerning: 'normal',
      fontOpticalSizing: 'auto',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: { margin: 0, textWrap: 'pretty' },
    'blockquote, figure': { margin: 0 },
    a: { color: 'accent', textDecoration: 'none' },
    'a:hover': { color: 'accentAlt' },
    '::selection': { background: 'accent', color: 'accentText' },
  },

  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },

  theme: {
    tokens: {
      colors: {
        amethyst: {
          50: { value: '#f7f0fb' },
          100: { value: '#eddff6' },
          200: { value: '#dcc0ee' },
          300: { value: '#c69ce3' },
          400: { value: '#ad77d6' },
          500: { value: '#9a52c8' },
          600: { value: '#8339ad' },
          700: { value: '#682c89' },
          800: { value: '#4b2062' },
          900: { value: '#2f153e' },
        },
        ink: {
          50: { value: '#f5f3f8' },
          100: { value: '#e8e5ee' },
          200: { value: '#cfcbd9' },
          300: { value: '#aaa4ba' },
          400: { value: '#7e788f' },
          500: { value: '#5d586f' },
          600: { value: '#443f55' },
          700: { value: '#302b40' },
          800: { value: '#1e1a2e' },
          900: { value: '#14101f' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '1px' },
        md: { value: '3px' },
        lg: { value: '6px' },
        full: { value: '9999px' },
      },
    },

    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.ink.900}' } },
        bgAlt: { value: { base: '{colors.ink.800}' } },
        surface: { value: { base: '{colors.amethyst.900}' } },

        text: { value: { base: '{colors.ink.50}' } },
        textMuted: { value: { base: '{colors.ink.200}' } },
        textFaint: { value: { base: '{colors.ink.400}' } },

        accent: { value: { base: '{colors.amethyst.400}' } },
        accentText: { value: { base: '{colors.amethyst.900}' } },
        accentAlt: { value: { base: '{colors.amethyst.300}' } },

        border: { value: { base: '{colors.ink.700}' } },
        borderStrong: { value: { base: '{colors.amethyst.600}' } },

        field: { value: { base: '{colors.amethyst.800}' } },
        fieldInk: { value: { base: '{colors.amethyst.50}' } },
        fieldInkMuted: { value: { base: '{colors.amethyst.200}' } },
        fieldBorder: { value: { base: '{colors.amethyst.600}' } },
      },
    },
  },
})