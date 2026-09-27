import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      lineHeight: 1.5,
      fontFeatureSettings: '"tnum" 1, "kern" 1',
      fontVariantLigatures: 'none',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
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
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    'table, tbody, tr, td': {
      fontVariantNumeric: 'tabular-nums',
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
          50: { value: '#e8f5f0' },
          100: { value: '#cceadf' },
          200: { value: '#a3d6c8' },
          300: { value: '#72bda9' },
          400: { value: '#479f89' },
          500: { value: '#2f8270' },
          600: { value: '#226a5b' },
          700: { value: '#1a5449' },
          800: { value: '#123c34' },
          900: { value: '#0b2620' },
        },
        amber: {
          50: { value: '#fcf4e0' },
          100: { value: '#f7e7ba' },
          200: { value: '#efd184' },
          300: { value: '#e6b954' },
          400: { value: '#ddaa3d' },
          500: { value: '#c48f2c' },
          600: { value: '#a2751f' },
          700: { value: '#7e5a19' },
          800: { value: '#5a4012' },
          900: { value: '#3a2a0b' },
        },
        neutral: {
          50: { value: '#eef3f1' },
          100: { value: '#dde7e3' },
          200: { value: '#c1d1cb' },
          300: { value: '#9bb2aa' },
          400: { value: '#6f8981' },
          500: { value: '#4e675f' },
          600: { value: '#3a4e47' },
          700: { value: '#2b3a35' },
          800: { value: '#1c2723' },
          900: { value: '#0e1512' },
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
        bg: { value: { base: '{colors.green.900}' } },
        bgAlt: { value: { base: '{colors.green.800}' } },
        surface: { value: { base: '{colors.green.700}' } },
        text: { value: { base: '{colors.green.50}' } },
        textMuted: { value: { base: '{colors.green.200}' } },
        textFaint: { value: { base: '{colors.green.300}' } },
        accent: { value: { base: '{colors.amber.400}' } },
        accentText: { value: { base: '{colors.green.900}' } },
        accentAlt: { value: { base: '{colors.amber.200}' } },
        border: { value: { base: '{colors.green.700}' } },
        borderStrong: { value: { base: '{colors.green.500}' } },
        field: { value: { base: '{colors.amber.400}' } },
        fieldInk: { value: { base: '{colors.green.900}' } },
        fieldInkMuted: { value: { base: '{colors.amber.800}' } },
        fieldBorder: { value: { base: '{colors.amber.700}' } },
      },
    },
  },
})