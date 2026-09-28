import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
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
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p, li, blockquote': {
      textWrap: 'pretty',
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
        violet: {
          50: { value: '#EFEBFB' },
          100: { value: '#DED7F8' },
          200: { value: '#C2B7F3' },
          300: { value: '#9E8FEE' },
          400: { value: '#7C68E8' },
          500: { value: '#5B44D6' },
          600: { value: '#4E3CB0' },
          700: { value: '#3B2C86' },
          800: { value: '#2C2160' },
          900: { value: '#201748' },
        },
        sand: {
          50: { value: '#F9F6F0' },
          100: { value: '#F4F1EA' },
          200: { value: '#E9E4D8' },
          300: { value: '#D8D2C4' },
          400: { value: '#BDB5A4' },
          500: { value: '#948B78' },
          600: { value: '#6E6656' },
          700: { value: '#5A5346' },
          800: { value: '#322E27' },
          900: { value: '#211F1B' },
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
        bg: { value: { base: '{colors.sand.100}' } },
        bgAlt: { value: { base: '{colors.sand.200}' } },
        surface: { value: { base: '{colors.sand.50}' } },
        text: { value: { base: '{colors.sand.900}' } },
        textMuted: { value: { base: '{colors.sand.700}' } },
        textFaint: { value: { base: '{colors.sand.600}' } },
        accent: { value: { base: '{colors.violet.500}' } },
        accentText: { value: { base: '#FFFFFF' } },
        accentAlt: { value: { base: '{colors.violet.400}' } },
        border: { value: { base: '{colors.sand.300}' } },
        borderStrong: { value: { base: '{colors.sand.900}' } },
        field: { value: { base: '{colors.violet.800}' } },
        fieldInk: { value: { base: '{colors.violet.50}' } },
        fieldInkMuted: { value: { base: '{colors.violet.300}' } },
        fieldBorder: { value: { base: '{colors.violet.700}' } },
      },
    },
  },
})