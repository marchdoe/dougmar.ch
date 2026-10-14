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
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    a: {
      color: 'text',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      textWrap: 'pretty',
    },
    'h1': {
      fontOpticalSizing: 'auto',
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
        red: {
          50: { value: '#FFF0EB' },
          100: { value: '#FFDDD2' },
          200: { value: '#FFBDA8' },
          300: { value: '#FF9478' },
          400: { value: '#FF6E4D' },
          500: { value: '#F0391E' },
          600: { value: '#C62A10' },
          700: { value: '#961F0C' },
          800: { value: '#6B1709' },
          900: { value: '#420E05' },
        },
        clay: {
          50: { value: '#FBF4EF' },
          100: { value: '#F4E7DD' },
          200: { value: '#E6D2C4' },
          300: { value: '#D0B6A6' },
          400: { value: '#AD9183' },
          500: { value: '#866B5F' },
          600: { value: '#5E483F' },
          700: { value: '#3E2C27' },
          800: { value: '#241715' },
          900: { value: '#160C0A' },
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
        bg: { value: { base: '{colors.clay.900}' } },
        bgAlt: { value: { base: '{colors.red.900}' } },
        surface: { value: { base: '{colors.clay.800}' } },
        text: { value: { base: '{colors.clay.50}' } },
        textMuted: { value: { base: '{colors.clay.300}' } },
        textFaint: { value: { base: '{colors.clay.400}' } },
        accent: { value: { base: '{colors.red.500}' } },
        accentText: { value: { base: '{colors.clay.900}' } },
        accentAlt: { value: { base: '{colors.red.400}' } },
        border: { value: { base: '{colors.clay.700}' } },
        borderStrong: { value: { base: '{colors.clay.600}' } },
        field: { value: { base: '{colors.red.500}' } },
        fieldInk: { value: { base: '{colors.clay.900}' } },
        fieldInkMuted: { value: { base: '{colors.red.900}' } },
        fieldBorder: { value: { base: '{colors.red.700}' } },
      },
    },
  },
})