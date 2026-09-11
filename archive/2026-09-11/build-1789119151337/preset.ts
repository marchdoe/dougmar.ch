import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
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
      transition: 'color 120ms ease',
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
          50: { value: '#E9F9EC' },
          100: { value: '#CDEFD4' },
          200: { value: '#9FE0AC' },
          300: { value: '#6BCE7F' },
          400: { value: '#43BC57' },
          500: { value: '#2BAE3B' },
          600: { value: '#1F8C2E' },
          700: { value: '#176B24' },
          800: { value: '#12531E' },
          900: { value: '#0E3316' },
        },
        sage: {
          50: { value: '#F3F8F2' },
          100: { value: '#E7F1E6' },
          200: { value: '#D3E2D2' },
          300: { value: '#B2C9B1' },
          400: { value: '#86A385' },
          500: { value: '#5F7D5E' },
          600: { value: '#476246' },
          700: { value: '#354A34' },
          800: { value: '#212F21' },
          900: { value: '#101810' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0' },
        md: { value: '0' },
        lg: { value: '2px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.sage.50}' } },
        bgAlt: { value: { base: '{colors.sage.100}' } },
        surface: { value: { base: '#FFFFFF' } },
        text: { value: { base: '{colors.sage.900}' } },
        textMuted: { value: { base: '{colors.sage.700}' } },
        textFaint: { value: { base: '{colors.sage.600}' } },
        accent: { value: { base: '{colors.green.500}' } },
        accentText: { value: { base: '{colors.sage.900}' } },
        accentAlt: { value: { base: '{colors.green.700}' } },
        border: { value: { base: '{colors.sage.200}' } },
        borderStrong: { value: { base: '{colors.sage.700}' } },
        field: { value: { base: '{colors.green.900}' } },
        fieldInk: { value: { base: '{colors.sage.50}' } },
        fieldInkMuted: { value: { base: '{colors.green.200}' } },
        fieldBorder: { value: { base: '{colors.green.800}' } },
      },
    },
  },
})