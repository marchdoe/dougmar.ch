import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
    },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
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
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        azure: {
          50: { value: '#eaf4fa' },
          100: { value: '#d0e7f4' },
          200: { value: '#a6d2ea' },
          300: { value: '#6fb6db' },
          400: { value: '#3d97c6' },
          500: { value: '#1a7fb5' },
          600: { value: '#0f6598' },
          700: { value: '#0d4f78' },
          800: { value: '#103f5f' },
          900: { value: '#112f45' },
        },
        marigold: {
          50: { value: '#fcf1de' },
          100: { value: '#f8dfae' },
          200: { value: '#f2c46f' },
          300: { value: '#eaa63b' },
          400: { value: '#e8961f' },
          500: { value: '#cc7d12' },
          600: { value: '#a5620d' },
          700: { value: '#7d4a0c' },
          800: { value: '#5c370c' },
          900: { value: '#3f260a' },
        },
        slate: {
          50: { value: '#f4f7f9' },
          100: { value: '#e7edf1' },
          200: { value: '#d3dde3' },
          300: { value: '#b3c2cb' },
          400: { value: '#8a9ba6' },
          500: { value: '#66757f' },
          600: { value: '#4c5a62' },
          700: { value: '#374349' },
          800: { value: '#232c31' },
          900: { value: '#141a1d' },
        },
        white: { value: '#ffffff' },
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
        bg: { value: { base: '{colors.slate.50}' } },
        bgAlt: { value: { base: '{colors.slate.100}' } },
        surface: { value: { base: '{colors.white}' } },
        text: { value: { base: '{colors.slate.900}' } },
        textMuted: { value: { base: '{colors.slate.600}' } },
        textFaint: { value: { base: '{colors.slate.500}' } },
        accent: { value: { base: '{colors.azure.600}' } },
        accentText: { value: { base: '{colors.white}' } },
        accentAlt: { value: { base: '{colors.azure.400}' } },
        border: { value: { base: '{colors.slate.200}' } },
        borderStrong: { value: { base: '{colors.slate.300}' } },
        field: { value: { base: '{colors.azure.800}' } },
        fieldInk: { value: { base: '{colors.azure.50}' } },
        fieldInkMuted: { value: { base: '{colors.azure.200}' } },
        fieldBorder: { value: { base: '{colors.azure.600}' } },
      },
    },
  },
})