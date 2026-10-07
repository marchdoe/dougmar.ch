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
      margin: 0,
      fontKerning: 'normal',
      fontVariantNumeric: 'tabular-nums',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
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
    'ul, ol': {
      margin: 0,
      padding: 0,
      listStyle: 'none',
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
        ink: {
          50: { value: '#eef1f7' },
          100: { value: '#dce2ee' },
          200: { value: '#b9c4da' },
          300: { value: '#9aa6c2' },
          400: { value: '#72819f' },
          500: { value: '#4b5a7d' },
          600: { value: '#394662' },
          700: { value: '#2a3449' },
          800: { value: '#1a2133' },
          900: { value: '#0b0f1a' },
        },
        azure: {
          50: { value: '#eaf1fc' },
          100: { value: '#cfe0f8' },
          200: { value: '#a2c3ef' },
          300: { value: '#6f9fe3' },
          400: { value: '#447ad3' },
          500: { value: '#2a5dba' },
          600: { value: '#214a97' },
          700: { value: '#1a3972' },
          800: { value: '#142a54' },
          900: { value: '#0e1c38' },
        },
        red: {
          50: { value: '#ffeceb' },
          100: { value: '#ffd3d0' },
          200: { value: '#ffaba5' },
          300: { value: '#ff7d75' },
          400: { value: '#f94f45' },
          500: { value: '#e8322d' },
          600: { value: '#c21f1c' },
          700: { value: '#961716' },
          800: { value: '#6d1312' },
          900: { value: '#470c0c' },
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
        bg: { value: { base: '{colors.ink.900}' } },
        bgAlt: { value: { base: '{colors.azure.900}' } },
        surface: { value: { base: '{colors.ink.800}' } },
        text: { value: { base: '{colors.ink.50}' } },
        textMuted: { value: { base: '{colors.ink.300}' } },
        textFaint: { value: { base: '{colors.ink.400}' } },
        accent: { value: { base: '{colors.red.500}' } },
        accentText: { value: { base: '#fff6f5' } },
        accentAlt: { value: { base: '{colors.red.400}' } },
        border: { value: { base: '{colors.ink.700}' } },
        borderStrong: { value: { base: '{colors.ink.600}' } },
        field: { value: { base: '{colors.azure.800}' } },
        fieldInk: { value: { base: '{colors.ink.50}' } },
        fieldInkMuted: { value: { base: '{colors.azure.200}' } },
        fieldBorder: { value: { base: '{colors.azure.700}' } },
      },
    },
  },
})