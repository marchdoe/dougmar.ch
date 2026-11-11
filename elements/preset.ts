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
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      margin: 0,
      textWrap: 'pretty',
    },
    a: {
      color: 'text',
      textDecoration: 'none',
      transition: 'color 160ms ease, text-decoration-color 160ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
      textDecorationLine: 'underline',
      textDecorationColor: 'accent',
      textUnderlineOffset: '0.18em',
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
        navy: {
          50: { value: '#f1f5fb' },
          100: { value: '#d6e3f1' },
          200: { value: '#aec8e3' },
          300: { value: '#7aa2cf' },
          400: { value: '#4a7cb8' },
          500: { value: '#2a5e9c' },
          600: { value: '#1f4a7d' },
          700: { value: '#16365c' },
          800: { value: '#102743' },
          900: { value: '#0a1a2e' },
        },
        brass: {
          50: { value: '#fbf4de' },
          100: { value: '#f6e6b8' },
          200: { value: '#eecd7f' },
          300: { value: '#e3b354' },
          400: { value: '#cf9a33' },
          500: { value: '#a87d26' },
          600: { value: '#805f1d' },
          700: { value: '#5c4415' },
          800: { value: '#3c2d0e' },
          900: { value: '#231a08' },
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
        bg: { value: '{colors.navy.700}' },
        bgAlt: { value: '{colors.navy.800}' },
        surface: { value: '{colors.navy.600}' },
        text: { value: '{colors.navy.50}' },
        textMuted: { value: '{colors.navy.200}' },
        textFaint: { value: '{colors.navy.300}' },
        accent: { value: '{colors.brass.300}' },
        accentText: { value: '{colors.navy.900}' },
        accentAlt: { value: '{colors.brass.200}' },
        border: { value: '{colors.navy.500}' },
        borderStrong: { value: '{colors.navy.400}' },
        field: { value: '{colors.navy.800}' },
        fieldInk: { value: '{colors.navy.50}' },
        fieldInkMuted: { value: '{colors.navy.200}' },
        fieldBorder: { value: '{colors.navy.500}' },
      },
    },
  },
})