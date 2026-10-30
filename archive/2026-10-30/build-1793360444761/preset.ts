import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
      margin: '0',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      margin: '0',
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
        textUnderlineOffset: '0.18em',
      },
    },
    'figure': { margin: '0' },
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '2px',
    },
  },

  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
    hover: '&:hover',
  },

  theme: {
    tokens: {
      colors: {
        amber: {
          50: { value: '#FCF5E6' },
          100: { value: '#F8E8C0' },
          200: { value: '#F0D184' },
          300: { value: '#E6B747' },
          400: { value: '#D99E1C' },
          500: { value: '#9C6E0A' },
          600: { value: '#8A5600' },
          700: { value: '#6B4300' },
          800: { value: '#4A2F00' },
          900: { value: '#2E1D00' },
        },
        sand: {
          50: { value: '#FDF9EF' },
          100: { value: '#F6EDDB' },
          200: { value: '#ECDCBF' },
          300: { value: '#D3BE93' },
          400: { value: '#9A8C6B' },
          500: { value: '#756A49' },
          600: { value: '#5C5139' },
          700: { value: '#423A29' },
          800: { value: '#2A2318' },
          900: { value: '#191409' },
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
          value: { base: '{colors.sand.100}', _dark: '{colors.sand.900}' },
        },
        bgAlt: {
          value: { base: '{colors.sand.200}', _dark: '{colors.sand.800}' },
        },
        surface: {
          value: { base: '{colors.sand.50}', _dark: '{colors.sand.700}' },
        },
        text: {
          value: { base: '{colors.sand.900}', _dark: '{colors.sand.50}' },
        },
        textMuted: {
          value: { base: '{colors.sand.600}', _dark: '{colors.sand.300}' },
        },
        textFaint: {
          value: { base: '{colors.sand.500}', _dark: '{colors.sand.400}' },
        },
        accent: {
          value: { base: '{colors.amber.600}', _dark: '{colors.amber.400}' },
        },
        accentText: {
          value: { base: '{colors.amber.50}', _dark: '{colors.amber.900}' },
        },
        accentAlt: {
          value: { base: '{colors.amber.500}', _dark: '{colors.amber.300}' },
        },
        border: {
          value: { base: '{colors.sand.300}', _dark: '{colors.sand.700}' },
        },
        borderStrong: {
          value: { base: '{colors.sand.400}', _dark: '{colors.sand.600}' },
        },
        field: {
          value: { base: '{colors.amber.400}', _dark: '{colors.amber.400}' },
        },
        fieldInk: {
          value: { base: '{colors.amber.900}', _dark: '{colors.amber.900}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.amber.700}', _dark: '{colors.amber.700}' },
        },
        fieldBorder: {
          value: { base: '{colors.amber.600}', _dark: '{colors.amber.600}' },
        },
      },
    },
  },
})