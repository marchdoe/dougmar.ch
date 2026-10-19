import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
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
      transition: 'color 120ms ease, text-decoration-color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
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
        paper: {
          50: { value: '#FAF7F0' },
          100: { value: '#F1EBDC' },
          200: { value: '#E3DAC6' },
          300: { value: '#CFC3A6' },
          400: { value: '#AB9E7F' },
          500: { value: '#766B50' },
          600: { value: '#5B523E' },
          700: { value: '#403928' },
          800: { value: '#262113' },
          900: { value: '#16130A' },
        },
        marigold: {
          50: { value: '#FDF7E1' },
          100: { value: '#FAEEBE' },
          200: { value: '#F5DF85' },
          300: { value: '#EFCE4A' },
          400: { value: '#E0B41E' },
          500: { value: '#BE9510' },
          600: { value: '#9A780C' },
          700: { value: '#74590A' },
          800: { value: '#4E3C07' },
          900: { value: '#2C2204' },
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
        bg: { value: '{colors.paper.50}' },
        bgAlt: { value: '{colors.paper.100}' },
        surface: { value: '#FFFDF6' },
        text: { value: '{colors.paper.800}' },
        textMuted: { value: '{colors.paper.600}' },
        textFaint: { value: '{colors.paper.500}' },
        accent: { value: '{colors.marigold.700}' },
        accentText: { value: '{colors.marigold.50}' },
        accentAlt: { value: '{colors.marigold.500}' },
        border: { value: '{colors.paper.200}' },
        borderStrong: { value: '{colors.paper.400}' },
        field: { value: '{colors.marigold.300}' },
        fieldInk: { value: '{colors.paper.800}' },
        fieldInkMuted: { value: '#5A4708' },
        fieldBorder: { value: '#A07E10' },
      },
    },
  },
})