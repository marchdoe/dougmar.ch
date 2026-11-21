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
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover, a:focus-visible': {
      color: 'accentAlt',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover, &:focus-visible',
  },
  theme: {
    tokens: {
      colors: {
        green: {
          50: { value: '#e9f9f0' },
          100: { value: '#c6efd8' },
          200: { value: '#93e0b4' },
          300: { value: '#58cc8b' },
          400: { value: '#27b96b' },
          500: { value: '#11a159' },
          600: { value: '#0c8248' },
          700: { value: '#0b6438' },
          800: { value: '#0a4b2b' },
          900: { value: '#07331e' },
        },
        mint: {
          50: { value: '#e4fcef' },
          100: { value: '#bdf6d5' },
          200: { value: '#86edb0' },
          300: { value: '#4ce38c' },
          400: { value: '#2fd676' },
          500: { value: '#19bf61' },
          600: { value: '#12a052' },
          700: { value: '#0e8347' },
          800: { value: '#0b6438' },
          900: { value: '#07421f' },
        },
        neutral: {
          50: { value: '#f6f9f7' },
          100: { value: '#e7ede9' },
          200: { value: '#cdd6cf' },
          300: { value: '#a7b2aa' },
          400: { value: '#78857c' },
          500: { value: '#566058' },
          600: { value: '#3c453f' },
          700: { value: '#272f2a' },
          800: { value: '#161b17' },
          900: { value: '#0b100d' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '3px' },
        lg: { value: '6px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.neutral.900}', _light: '{colors.neutral.100}' } },
        bgAlt: { value: { base: '{colors.green.900}', _light: '{colors.green.50}' } },
        surface: { value: { base: '{colors.neutral.800}', _light: '{colors.neutral.50}' } },
        text: { value: { base: '{colors.neutral.50}', _light: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.300}', _light: '{colors.neutral.600}' } },
        textFaint: { value: { base: '{colors.neutral.400}', _light: '{colors.neutral.500}' } },
        accent: { value: { base: '{colors.mint.400}', _light: '{colors.green.700}' } },
        accentText: { value: { base: '{colors.neutral.900}', _light: '{colors.neutral.50}' } },
        accentAlt: { value: { base: '{colors.mint.200}', _light: '{colors.green.600}' } },
        border: { value: { base: '{colors.neutral.700}', _light: '{colors.neutral.200}' } },
        borderStrong: { value: { base: '{colors.neutral.500}', _light: '{colors.neutral.400}' } },
        field: { value: { base: '{colors.green.800}', _light: '{colors.green.800}' } },
        fieldInk: { value: { base: '{colors.neutral.50}', _light: '{colors.neutral.50}' } },
        fieldInkMuted: { value: { base: '{colors.mint.200}', _light: '{colors.mint.200}' } },
        fieldBorder: { value: { base: '{colors.green.500}', _light: '{colors.green.500}' } },
      },
    },
  },
})