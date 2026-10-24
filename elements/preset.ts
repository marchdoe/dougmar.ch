import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    html: {
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
    },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      fontVariantNumeric: 'tabular-nums',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
    hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        amber: {
          50: { value: '#FEF6E8' },
          100: { value: '#FCEAC8' },
          200: { value: '#F8D491' },
          300: { value: '#F3BC54' },
          400: { value: '#ECA428' },
          500: { value: '#D07C0C' },
          600: { value: '#BE7310' },
          700: { value: '#94590C' },
          800: { value: '#653D07' },
          900: { value: '#3A2204' },
        },
        oxblood: {
          50: { value: '#FBEAE4' },
          100: { value: '#F6CFC2' },
          200: { value: '#EBA48E' },
          300: { value: '#DD7154' },
          400: { value: '#C9472A' },
          500: { value: '#A82E15' },
          600: { value: '#8A2210' },
          700: { value: '#6A180B' },
          800: { value: '#4A1007' },
          900: { value: '#2E0A04' },
        },
        umber: {
          50: { value: '#F7F1E6' },
          100: { value: '#EADCC4' },
          200: { value: '#D3BD94' },
          300: { value: '#B2975F' },
          400: { value: '#8A6E3C' },
          500: { value: '#654E28' },
          600: { value: '#5E4414' },
          700: { value: '#3E2D0C' },
          800: { value: '#2A1D0B' },
          900: { value: '#1C1004' },
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
        bg: { value: { base: '{colors.amber.500}' } },
        bgAlt: { value: { base: '{colors.amber.600}' } },
        surface: { value: { base: '{colors.amber.400}' } },
        text: { value: { base: '{colors.umber.900}' } },
        textMuted: { value: { base: '{colors.umber.800}' } },
        textFaint: { value: { base: '{colors.umber.700}' } },
        accent: { value: { base: '{colors.oxblood.500}' } },
        accentText: { value: { base: '{colors.amber.50}' } },
        accentAlt: { value: { base: '{colors.oxblood.700}' } },
        border: { value: { base: '{colors.amber.700}' } },
        borderStrong: { value: { base: '{colors.umber.800}' } },
        field: { value: { base: '{colors.umber.900}' } },
        fieldInk: { value: { base: '{colors.amber.100}' } },
        fieldInkMuted: { value: { base: '{colors.amber.300}' } },
        fieldBorder: { value: { base: '{colors.amber.700}' } },
      },
    },
  },
})