import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    ':root': {
      '--selection-bg': '{colors.accent.600}',
    },
    '*': {
      boxSizing: 'border-box',
    },
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
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      margin: 0,
      textWrap: 'pretty',
    },
    'p, li, blockquote': {
      maxWidth: '66ch',
    },
    'a': {
      color: 'text',
      textDecoration: 'underline',
      textDecorationColor: 'accent',
      textUnderlineOffset: '2px',
      transition: 'color 120ms ease, text-decoration-color 120ms ease',
    },
    'a:hover': {
      color: 'accent',
      textDecorationColor: 'accent',
    },
    'table': {
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
        primary: {
          50: { value: '#FDF5DD' },
          100: { value: '#FBE8B4' },
          200: { value: '#F8D583' },
          300: { value: '#F5C150' },
          400: { value: '#F2AE2B' },
          500: { value: '#E2990F' },
          600: { value: '#BC7B0C' },
          700: { value: '#935F0D' },
          800: { value: '#6E470D' },
          900: { value: '#43300F' },
        },
        accent: {
          50: { value: '#FBEBE2' },
          100: { value: '#F6D0BE' },
          200: { value: '#EDA986' },
          300: { value: '#E07E50' },
          400: { value: '#CF5A28' },
          500: { value: '#B2440F' },
          600: { value: '#A1320A' },
          700: { value: '#7E2708' },
          800: { value: '#5C1D06' },
          900: { value: '#3A1304' },
        },
        neutral: {
          50: { value: '#FBF6EC' },
          100: { value: '#F4EAD6' },
          200: { value: '#E6D7B8' },
          300: { value: '#CBB98E' },
          400: { value: '#A08A5E' },
          500: { value: '#74613A' },
          600: { value: '#574726' },
          700: { value: '#3E3119' },
          800: { value: '#2A2010' },
          900: { value: '#1A1308' },
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
        bg: { value: { base: '{colors.primary.400}' } },
        bgAlt: { value: { base: '{colors.primary.500}' } },
        surface: { value: { base: '{colors.primary.100}' } },
        text: { value: { base: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.700}' } },
        textFaint: { value: { base: '{colors.neutral.600}' } },
        accent: { value: { base: '{colors.accent.600}' } },
        accentText: { value: { base: '{colors.primary.50}' } },
        accentAlt: { value: { base: '{colors.accent.400}' } },
        border: { value: { base: '{colors.primary.600}' } },
        borderStrong: { value: { base: '{colors.neutral.700}' } },
        field: { value: { base: '{colors.accent.700}' } },
        fieldInk: { value: { base: '{colors.primary.50}' } },
        fieldInkMuted: { value: { base: '{colors.primary.200}' } },
        fieldBorder: { value: { base: '{colors.accent.400}' } },
      },
    },
  },
})