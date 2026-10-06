import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    'html, body': {
      margin: 0,
      padding: 0,
    },
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
    },
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    'h1, h2, h3': {
      textWrap: 'balance',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
        textDecorationColor: 'accent',
      },
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:is(:hover, [data-hover])',
  },
  theme: {
    tokens: {
      colors: {
        gold: {
          50: { value: '#F7F9E6' },
          100: { value: '#ECF1C5' },
          200: { value: '#DBE593' },
          300: { value: '#BDCE5E' },
          400: { value: '#9FB63D' },
          500: { value: '#829A2A' },
          600: { value: '#647A1E' },
          700: { value: '#495817' },
          800: { value: '#313D10' },
          900: { value: '#1D2408' },
        },
        rust: {
          50: { value: '#FBEEE2' },
          100: { value: '#F6D9C0' },
          200: { value: '#EDB488' },
          300: { value: '#E08F55' },
          400: { value: '#CE6D30' },
          500: { value: '#B9541C' },
          600: { value: '#983F13' },
          700: { value: '#732F0F' },
          800: { value: '#4F210B' },
          900: { value: '#2E1306' },
        },
        neutral: {
          50: { value: '#F8F9F1' },
          100: { value: '#EEEFE3' },
          200: { value: '#DBDDC9' },
          300: { value: '#BFC2A8' },
          400: { value: '#989B80' },
          500: { value: '#71745C' },
          600: { value: '#535643' },
          700: { value: '#3C3E2E' },
          800: { value: '#26271C' },
          900: { value: '#16180E' },
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
        bg: { value: { base: '{colors.gold.300}' } },
        bgAlt: { value: { base: '{colors.gold.400}' } },
        surface: { value: { base: '{colors.gold.100}' } },
        text: { value: { base: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.800}' } },
        textFaint: { value: { base: '{colors.neutral.700}' } },
        accent: { value: { base: '{colors.rust.500}' } },
        accentText: { value: { base: '{colors.gold.50}' } },
        accentAlt: { value: { base: '{colors.rust.300}' } },
        border: { value: { base: '{colors.gold.600}' } },
        borderStrong: { value: { base: '{colors.gold.800}' } },
        field: { value: { base: '{colors.gold.900}' } },
        fieldInk: { value: { base: '{colors.gold.50}' } },
        fieldInkMuted: { value: { base: '{colors.gold.200}' } },
        fieldBorder: { value: { base: '{colors.gold.600}' } },
      },
    },
  },
})