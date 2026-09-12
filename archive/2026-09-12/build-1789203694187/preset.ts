import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
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
      color: 'text',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  theme: {
    tokens: {
      colors: {
        emerald: {
          50: { value: '#e9f9f0' },
          100: { value: '#c9f0dc' },
          200: { value: '#9ee3c1' },
          300: { value: '#66cf9f' },
          400: { value: '#34b47d' },
          500: { value: '#199763' },
          600: { value: '#0f7a4f' },
          700: { value: '#0c5d3d' },
          800: { value: '#0a462f' },
          900: { value: '#062d1f' },
        },
        spring: {
          50: { value: '#ebfef4' },
          100: { value: '#ccfce1' },
          200: { value: '#9bf6c6' },
          300: { value: '#63eca6' },
          400: { value: '#35d98a' },
          500: { value: '#1cc077' },
          600: { value: '#12a063' },
          700: { value: '#0f7d4e' },
          800: { value: '#0d5f3d' },
          900: { value: '#093f29' },
        },
        moss: {
          50: { value: '#f3f7f4' },
          100: { value: '#e4ece7' },
          200: { value: '#cbd8cf' },
          300: { value: '#a8bcae' },
          400: { value: '#7f978a' },
          500: { value: '#5e7669' },
          600: { value: '#47594f' },
          700: { value: '#35443b' },
          800: { value: '#26312a' },
          900: { value: '#18201b' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0' },
        md: { value: '0' },
        lg: { value: '2px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.emerald.800}' } },
        bgAlt: { value: { base: '#07331f' } },
        surface: { value: { base: '{colors.emerald.700}' } },
        text: { value: { base: '{colors.moss.50}' } },
        textMuted: { value: { base: '{colors.moss.200}' } },
        textFaint: { value: { base: '{colors.moss.300}' } },
        accent: { value: { base: '{colors.spring.400}' } },
        accentText: { value: { base: '{colors.emerald.900}' } },
        accentAlt: { value: { base: '{colors.spring.200}' } },
        border: { value: { base: '#0e5238' } },
        borderStrong: { value: { base: '{colors.emerald.500}' } },
        field: { value: { base: '{colors.emerald.900}' } },
        fieldInk: { value: { base: '{colors.moss.50}' } },
        fieldInkMuted: { value: { base: '{colors.moss.200}' } },
        fieldBorder: { value: { base: '{colors.emerald.700}' } },
      },
    },
  },
})