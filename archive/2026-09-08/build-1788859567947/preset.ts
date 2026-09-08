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
      color: 'text',
      textDecoration: 'none',
      transition: 'color 140ms ease',
    },
    'a:hover': {
      color: 'accent',
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
        violet: {
          50: { value: '#f3f0fc' },
          100: { value: '#e6dff8' },
          200: { value: '#cdc0f0' },
          300: { value: '#ad97e4' },
          400: { value: '#8d6dd5' },
          500: { value: '#744ec3' },
          600: { value: '#5e39a6' },
          700: { value: '#492c82' },
          800: { value: '#352060' },
          900: { value: '#22163f' },
        },
        orchid: {
          50: { value: '#f6effe' },
          100: { value: '#ecdefe' },
          200: { value: '#ddc6ff' },
          300: { value: '#cbabff' },
          400: { value: '#ac81ff' },
          500: { value: '#8149e0' },
          600: { value: '#6a37bd' },
          700: { value: '#522a93' },
          800: { value: '#3b1f6a' },
          900: { value: '#271446' },
        },
        night: {
          50: { value: '#f5f3fa' },
          100: { value: '#e9e5f2' },
          200: { value: '#d3cde3' },
          300: { value: '#b1a8c8' },
          400: { value: '#877da2' },
          500: { value: '#665c84' },
          600: { value: '#4d4466' },
          700: { value: '#38314c' },
          800: { value: '#261f3a' },
          900: { value: '#17122c' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '3px' },
        lg: { value: '6px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.night.900}' } },
        bgAlt: { value: { base: '#201a34' } },
        surface: { value: { base: '{colors.night.800}' } },
        text: { value: { base: '#f2edfb' } },
        textMuted: { value: { base: '#c6bce0' } },
        textFaint: { value: { base: '#a99ec9' } },
        accent: { value: { base: '{colors.orchid.400}' } },
        accentText: { value: { base: '{colors.night.900}' } },
        accentAlt: { value: { base: '{colors.orchid.200}' } },
        border: { value: { base: '{colors.night.700}' } },
        borderStrong: { value: { base: '{colors.violet.600}' } },
        field: { value: { base: '{colors.violet.800}' } },
        fieldInk: { value: { base: '{colors.violet.50}' } },
        fieldInkMuted: { value: { base: '#cbbfe8' } },
        fieldBorder: { value: { base: '{colors.violet.600}' } },
      },
    },
  },
})