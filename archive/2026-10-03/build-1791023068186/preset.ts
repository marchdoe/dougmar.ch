import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'h1': {
      fontOpticalSizing: 'auto',
    },
    'p': {
      margin: 0,
      textWrap: 'pretty',
    },
    'p, li, blockquote': {
      maxWidth: '68ch',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    '.tnum': {
      fontVariantNumeric: 'tabular-nums',
    },
  },
  conditions: {
    light: '[data-color-mode=light] &',
    dark: '[data-color-mode=dark] &',
    hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        amber: {
          50: { value: '#FBF4E7' },
          100: { value: '#F7E7CC' },
          200: { value: '#F0D0A0' },
          300: { value: '#E8B873' },
          400: { value: '#E0A049' },
          500: { value: '#D4862A' },
          600: { value: '#B86D1C' },
          700: { value: '#8F5316' },
          800: { value: '#693D13' },
          900: { value: '#452810' },
        },
        paper: {
          50: { value: '#FAF6EF' },
          100: { value: '#F1EADD' },
          200: { value: '#E3D8C6' },
          300: { value: '#CDBDA2' },
          400: { value: '#9D8E76' },
          500: { value: '#6F624C' },
          600: { value: '#554A38' },
          700: { value: '#3E3628' },
          800: { value: '#2A251A' },
          900: { value: '#1A1710' },
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
        bg: { value: { base: '{colors.paper.50}' } },
        bgAlt: { value: { base: '{colors.paper.100}' } },
        surface: { value: { base: '#FEFBF5' } },
        text: { value: { base: '{colors.paper.900}' } },
        textMuted: { value: { base: '{colors.paper.600}' } },
        textFaint: { value: { base: '{colors.paper.500}' } },
        accent: { value: { base: '{colors.amber.500}' } },
        accentText: { value: { base: '{colors.paper.900}' } },
        accentAlt: { value: { base: '{colors.amber.600}' } },
        border: { value: { base: '{colors.paper.200}' } },
        borderStrong: { value: { base: '{colors.paper.400}' } },
        field: { value: { base: '{colors.amber.500}' } },
        fieldInk: { value: { base: '{colors.paper.900}' } },
        fieldInkMuted: { value: { base: '#3A2C12' } },
        fieldBorder: { value: { base: '{colors.amber.700}' } },
      },
    },
  },
})