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
      fontVariantNumeric: 'tabular-nums',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p, li, blockquote': {
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
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
        gold: {
          50: { value: '#FBF3DC' },
          100: { value: '#F6E7B4' },
          200: { value: '#F0D784' },
          300: { value: '#EFC94E' },
          400: { value: '#E8B735' },
          500: { value: '#D9A520' },
          600: { value: '#B5891C' },
          700: { value: '#9A5E0A' },
          800: { value: '#6E4A12' },
          900: { value: '#3A2E0E' },
        },
        ink: {
          50: { value: '#F4EAD0' },
          100: { value: '#DFD1AC' },
          200: { value: '#BCAC7E' },
          300: { value: '#9C8A5C' },
          400: { value: '#7A6A45' },
          500: { value: '#5A4D2F' },
          600: { value: '#46391C' },
          700: { value: '#342A13' },
          800: { value: '#241C0C' },
          850: { value: '#1D1709' },
          900: { value: '#17120A' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0' },
        md: { value: '0' },
        lg: { value: '0' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.ink.900}', _light: '{colors.gold.300}' } },
        bgAlt: { value: { base: '{colors.ink.800}', _light: '{colors.gold.400}' } },
        surface: { value: { base: '{colors.ink.850}', _light: '{colors.gold.100}' } },
        text: { value: { base: '{colors.ink.50}', _light: '{colors.ink.900}' } },
        textMuted: { value: { base: '{colors.ink.200}', _light: '{colors.ink.700}' } },
        textFaint: { value: { base: '{colors.ink.300}', _light: '{colors.ink.600}' } },
        accent: { value: { base: '{colors.gold.400}', _light: '{colors.gold.700}' } },
        accentText: { value: { base: '{colors.ink.900}', _light: '{colors.gold.50}' } },
        accentAlt: { value: { base: '{colors.gold.200}', _light: '{colors.gold.600}' } },
        border: { value: { base: '{colors.ink.700}', _light: '{colors.gold.500}' } },
        borderStrong: { value: { base: '{colors.ink.600}', _light: '{colors.gold.700}' } },
        field: { value: { base: '{colors.gold.400}', _light: '{colors.ink.900}' } },
        fieldInk: { value: { base: '{colors.ink.900}', _light: '{colors.gold.300}' } },
        fieldInkMuted: { value: { base: '{colors.ink.700}', _light: '{colors.gold.600}' } },
        fieldBorder: { value: { base: '{colors.gold.700}', _light: '{colors.gold.800}' } },
      },
    },
  },
})