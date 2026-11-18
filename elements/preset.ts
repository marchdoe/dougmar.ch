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
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accent',
      textDecorationColor: 'accent',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      textWrap: 'pretty',
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
        amber: {
          50: { value: '#FBF1DD' },
          100: { value: '#F8E3BE' },
          200: { value: '#F3CE8C' },
          300: { value: '#EFB85C' },
          400: { value: '#E8972A' },
          500: { value: '#CE7F18' },
          600: { value: '#B86D12' },
          700: { value: '#8F520D' },
          800: { value: '#613808' },
          900: { value: '#3A2105' },
        },
        sand: {
          50: { value: '#FBF7F0' },
          100: { value: '#F5EEE0' },
          200: { value: '#E9DCC6' },
          300: { value: '#D6C6A4' },
          400: { value: '#B3A079' },
          500: { value: '#806E4C' },
          600: { value: '#5F4F32' },
          700: { value: '#46391F' },
          800: { value: '#2C2313' },
          900: { value: '#1C160C' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '1px' },
        md: { value: '2px' },
        lg: { value: '3px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: '{colors.sand.50}' },
        bgAlt: { value: '{colors.amber.50}' },
        surface: { value: '{colors.sand.100}' },
        text: { value: '{colors.sand.900}' },
        textMuted: { value: '{colors.sand.600}' },
        textFaint: { value: '{colors.sand.500}' },
        accent: { value: '{colors.amber.400}' },
        accentText: { value: '{colors.sand.900}' },
        accentAlt: { value: '{colors.amber.200}' },
        border: { value: '{colors.sand.200}' },
        borderStrong: { value: '{colors.sand.400}' },
        field: { value: '{colors.amber.400}' },
        fieldInk: { value: '{colors.sand.900}' },
        fieldInkMuted: { value: '{colors.amber.800}' },
        fieldBorder: { value: '{colors.amber.600}' },
      },
    },
  },
})