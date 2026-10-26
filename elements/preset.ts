import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
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
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'table': {
      fontVariantNumeric: 'tabular-nums',
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
        brass: {
          50: { value: '#fbf4df' },
          100: { value: '#f6e8bd' },
          200: { value: '#ecd389' },
          300: { value: '#ddb954' },
          400: { value: '#cda235' },
          500: { value: '#b8882a' },
          600: { value: '#96691f' },
          700: { value: '#74501b' },
          800: { value: '#553b18' },
          900: { value: '#3a2911' },
        },
        umber: {
          50: { value: '#f9f5ec' },
          100: { value: '#f0e9d8' },
          200: { value: '#e0d4ba' },
          300: { value: '#c5b291' },
          400: { value: '#a08a63' },
          500: { value: '#7c6844' },
          600: { value: '#5e4e31' },
          700: { value: '#443820' },
          800: { value: '#2d2615' },
          900: { value: '#1b1710' },
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
        bg: { value: { base: '{colors.umber.50}', _light: '{colors.umber.50}', _dark: '{colors.umber.800}' } },
        bgAlt: { value: { base: '{colors.umber.100}', _light: '{colors.umber.100}', _dark: '{colors.umber.900}' } },
        surface: { value: { base: '#ffffff', _light: '#ffffff', _dark: '{colors.umber.700}' } },
        text: { value: { base: '{colors.umber.900}', _light: '{colors.umber.900}', _dark: '{colors.umber.50}' } },
        textMuted: { value: { base: '{colors.umber.600}', _light: '{colors.umber.600}', _dark: '{colors.umber.200}' } },
        textFaint: { value: { base: '{colors.umber.500}', _light: '{colors.umber.500}', _dark: '{colors.umber.300}' } },
        accent: { value: { base: '{colors.brass.600}', _light: '{colors.brass.600}', _dark: '{colors.brass.400}' } },
        accentText: { value: { base: '{colors.umber.50}', _light: '{colors.umber.50}', _dark: '{colors.umber.900}' } },
        accentAlt: { value: { base: '{colors.brass.700}', _light: '{colors.brass.700}', _dark: '{colors.brass.300}' } },
        border: { value: { base: '{colors.umber.200}', _light: '{colors.umber.200}', _dark: '{colors.umber.600}' } },
        borderStrong: { value: { base: '{colors.umber.400}', _light: '{colors.umber.400}', _dark: '{colors.umber.400}' } },
        field: { value: { base: '{colors.umber.900}', _light: '{colors.umber.900}', _dark: '{colors.umber.900}' } },
        fieldInk: { value: { base: '{colors.umber.50}', _light: '{colors.umber.50}', _dark: '{colors.umber.50}' } },
        fieldInkMuted: { value: { base: '{colors.brass.200}', _light: '{colors.brass.200}', _dark: '{colors.brass.200}' } },
        fieldBorder: { value: { base: '{colors.umber.600}', _light: '{colors.umber.600}', _dark: '{colors.umber.600}' } },
      },
    },
  },
})