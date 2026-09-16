import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      margin: '0',
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accentAlt',
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
        orange: {
          50: { value: '#FDF3EA' },
          100: { value: '#FBE2CF' },
          200: { value: '#F7C6A0' },
          300: { value: '#F3A76E' },
          400: { value: '#F0883F' },
          500: { value: '#E86F1E' },
          600: { value: '#C85A15' },
          700: { value: '#9E4611' },
          800: { value: '#6E320D' },
          900: { value: '#3E1D08' },
        },
        navy: {
          50: { value: '#EAF0F8' },
          100: { value: '#CDD9EC' },
          200: { value: '#9DB0D0' },
          300: { value: '#6D84AE' },
          400: { value: '#45608C' },
          500: { value: '#2C4770' },
          600: { value: '#1E3357' },
          700: { value: '#142440' },
          800: { value: '#0D1A30' },
          900: { value: '#081120' },
        },
        sand: {
          50: { value: '#FAF6F0' },
          100: { value: '#F0E8DC' },
          200: { value: '#E0D3C0' },
          300: { value: '#C9B79F' },
          400: { value: '#A89279' },
          500: { value: '#85705A' },
          600: { value: '#665442' },
          700: { value: '#48392C' },
          800: { value: '#2C2119' },
          900: { value: '#17100A' },
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
        bg: { value: '{colors.navy.800}' },
        bgAlt: { value: '{colors.navy.900}' },
        surface: { value: '{colors.navy.700}' },
        text: { value: '{colors.sand.50}' },
        textMuted: { value: '{colors.sand.200}' },
        textFaint: { value: '{colors.sand.400}' },
        accent: { value: '{colors.orange.500}' },
        accentText: { value: '{colors.navy.900}' },
        accentAlt: { value: '{colors.orange.400}' },
        border: { value: '{colors.navy.600}' },
        borderStrong: { value: '{colors.navy.500}' },
        field: { value: '{colors.orange.500}' },
        fieldInk: { value: '{colors.navy.900}' },
        fieldInkMuted: { value: '{colors.orange.900}' },
        fieldBorder: { value: '{colors.orange.700}' },
      },
    },
  },
})