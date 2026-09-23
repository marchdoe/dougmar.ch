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
      textWrap: 'balance',
      fontKerning: 'normal',
    },
    'p, li, blockquote': {
      textWrap: 'pretty',
    },
    'p': {
      margin: 0,
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
        clay: {
          50: { value: '#FBEDE4' },
          100: { value: '#F6D6C5' },
          200: { value: '#EDB197' },
          300: { value: '#E28E6B' },
          400: { value: '#D9703C' },
          500: { value: '#B24A26' },
          600: { value: '#97401F' },
          700: { value: '#7A331A' },
          800: { value: '#5C2714' },
          900: { value: '#3D190D' },
        },
        sand: {
          50: { value: '#FAF4EC' },
          100: { value: '#F5EBDF' },
          200: { value: '#EBDCC8' },
          300: { value: '#DBC6AB' },
          400: { value: '#C0A585' },
          500: { value: '#9C8264' },
          600: { value: '#74604A' },
          700: { value: '#524234' },
          800: { value: '#2E241A' },
          900: { value: '#1C1610' },
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
        bg: {
          value: { base: '{colors.sand.900}', _light: '{colors.sand.50}' },
        },
        bgAlt: {
          value: { base: '{colors.sand.800}', _light: '{colors.sand.100}' },
        },
        surface: {
          value: { base: '{colors.sand.700}', _light: '{colors.sand.200}' },
        },
        text: {
          value: { base: '{colors.sand.50}', _light: '{colors.sand.900}' },
        },
        textMuted: {
          value: { base: '{colors.sand.300}', _light: '{colors.sand.600}' },
        },
        textFaint: {
          value: { base: '{colors.sand.400}', _light: '{colors.sand.500}' },
        },
        accent: {
          value: { base: '{colors.clay.400}', _light: '{colors.clay.500}' },
        },
        accentText: {
          value: { base: '{colors.sand.900}', _light: '{colors.sand.50}' },
        },
        accentAlt: {
          value: { base: '{colors.clay.300}', _light: '{colors.clay.400}' },
        },
        border: {
          value: { base: '{colors.sand.700}', _light: '{colors.sand.200}' },
        },
        borderStrong: {
          value: { base: '{colors.sand.600}', _light: '{colors.sand.400}' },
        },
        field: {
          value: { base: '{colors.clay.500}', _light: '{colors.clay.500}' },
        },
        fieldInk: {
          value: { base: '{colors.sand.50}', _light: '{colors.sand.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.clay.100}', _light: '{colors.clay.100}' },
        },
        fieldBorder: {
          value: { base: '{colors.clay.700}', _light: '{colors.clay.700}' },
        },
      },
    },
  },
})