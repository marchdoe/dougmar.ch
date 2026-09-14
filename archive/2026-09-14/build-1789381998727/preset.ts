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
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      color: 'inherit',
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
        amber: {
          50: { value: '#FBF6EA' },
          100: { value: '#F6EBCF' },
          200: { value: '#ECD6A2' },
          300: { value: '#DEBB6E' },
          400: { value: '#CD9E42' },
          500: { value: '#B5831F' },
          600: { value: '#946818' },
          700: { value: '#6F4E15' },
          800: { value: '#4A3410' },
          900: { value: '#2C1F0A' },
        },
        marigold: {
          50: { value: '#FFF4DC' },
          100: { value: '#FEE4AE' },
          200: { value: '#FCCE72' },
          300: { value: '#F9B53E' },
          400: { value: '#EF9C1A' },
          500: { value: '#D9820F' },
          600: { value: '#B0670C' },
          700: { value: '#854E0C' },
          800: { value: '#5C360A' },
          900: { value: '#382108' },
        },
        sand: {
          50: { value: '#FAF5EC' },
          100: { value: '#F1E8D5' },
          200: { value: '#E3D2AD' },
          300: { value: '#CDB483' },
          400: { value: '#AB9059' },
          500: { value: '#7F6B42' },
          600: { value: '#5E4E30' },
          700: { value: '#443921' },
          800: { value: '#2C2515' },
          900: { value: '#1B160C' },
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
        bg: { value: { base: '{colors.sand.50}' } },
        bgAlt: { value: { base: '{colors.sand.100}' } },
        surface: { value: { base: '#FFFDF6' } },

        text: { value: { base: '{colors.sand.900}' } },
        textMuted: { value: { base: '{colors.sand.600}' } },
        textFaint: { value: { base: '{colors.sand.500}' } },

        accent: { value: { base: '{colors.marigold.400}' } },
        accentText: { value: { base: '{colors.sand.900}' } },
        accentAlt: { value: { base: '{colors.marigold.600}' } },

        border: { value: { base: '{colors.sand.200}' } },
        borderStrong: { value: { base: '{colors.sand.400}' } },

        field: { value: { base: '{colors.sand.800}' } },
        fieldInk: { value: { base: '{colors.sand.50}' } },
        fieldInkMuted: { value: { base: '{colors.sand.300}' } },
        fieldBorder: { value: { base: '{colors.sand.600}' } },
      },
    },
  },
})