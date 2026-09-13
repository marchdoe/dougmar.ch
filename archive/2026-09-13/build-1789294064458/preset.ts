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
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
    },
    '*': {
      boxSizing: 'border-box',
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
    'a:hover': {
      color: 'accentAlt',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    '.tnum': {
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
          50: { value: '#FEF2F1' },
          100: { value: '#FCDEDB' },
          200: { value: '#F7BAB5' },
          300: { value: '#EF8A83' },
          400: { value: '#E4564C' },
          500: { value: '#D0281E' },
          600: { value: '#AE1A12' },
          700: { value: '#85140E' },
          800: { value: '#5A0F0B' },
          900: { value: '#300807' },
        },
        accentGlow: {
          value: '#FF8A7A',
        },
        neutral: {
          50: { value: '#FAF3F2' },
          100: { value: '#EFE3E1' },
          200: { value: '#D8C4C1' },
          300: { value: '#B89C98' },
          400: { value: '#8F6E69' },
          500: { value: '#6B4C48' },
          600: { value: '#4E3532' },
          700: { value: '#362321' },
          800: { value: '#241413' },
          900: { value: '#160A09' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0px' },
        md: { value: '2px' },
        lg: { value: '4px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.neutral.900}' } },
        bgAlt: { value: { base: '{colors.neutral.800}' } },
        surface: { value: { base: '{colors.neutral.700}' } },
        text: { value: { base: '{colors.neutral.50}' } },
        textMuted: { value: { base: '{colors.neutral.300}' } },
        textFaint: { value: { base: '{colors.neutral.400}' } },
        accent: { value: { base: '{colors.primary.500}' } },
        accentText: { value: { base: '{colors.primary.50}' } },
        accentAlt: { value: { base: '{colors.primary.400}' } },
        border: { value: { base: '{colors.neutral.700}' } },
        borderStrong: { value: { base: '{colors.neutral.600}' } },
        field: { value: { base: '{colors.primary.600}' } },
        fieldInk: { value: { base: '{colors.primary.50}' } },
        fieldInkMuted: { value: { base: '{colors.primary.200}' } },
        fieldBorder: { value: { base: '{colors.primary.400}' } },
      },
    },
  },
})