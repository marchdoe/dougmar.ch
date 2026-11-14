import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontOpticalSizing: 'auto',
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
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:is(:hover, [data-hover])',
  },
  theme: {
    tokens: {
      colors: {
        teal: {
          50: { value: '#edfcf8' },
          100: { value: '#99f6e4' },
          200: { value: '#5eead4' },
          300: { value: '#2dd4bf' },
          400: { value: '#14b8a6' },
          500: { value: '#0f9d8e' },
          600: { value: '#0f766e' },
          700: { value: '#115e58' },
          800: { value: '#134e49' },
          900: { value: '#0a1513' },
        },
        amber: {
          50: { value: '#fef6e3' },
          100: { value: '#fbe6ad' },
          200: { value: '#f8d274' },
          300: { value: '#f5b63f' },
          400: { value: '#e39a1f' },
          500: { value: '#c37d14' },
          600: { value: '#95600f' },
          700: { value: '#5c4a1e' },
          800: { value: '#3a2f10' },
          900: { value: '#1a1206' },
        },
        ink: {
          50: { value: '#f1f6f4' },
          100: { value: '#e2ebe8' },
          200: { value: '#c3d1cc' },
          300: { value: '#9aaea8' },
          400: { value: '#7e948d' },
          500: { value: '#56726a' },
          600: { value: '#3a544e' },
          700: { value: '#2a413c' },
          800: { value: '#10201d' },
          900: { value: '#0a1513' },
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
        bg: { value: { base: '{colors.ink.900}', _light: '{colors.ink.50}' } },
        bgAlt: { value: { base: '{colors.ink.800}', _light: '{colors.ink.100}' } },
        surface: { value: { base: '#1a2e2a', _light: '#ffffff' } },
        text: { value: { base: '#e4ece9', _light: '#0e1c19' } },
        textMuted: { value: { base: '{colors.ink.300}', _light: '#46605a' } },
        textFaint: { value: { base: '{colors.ink.400}', _light: '#566c66' } },
        accent: { value: { base: '{colors.teal.300}', _light: '{colors.teal.600}' } },
        accentText: { value: { base: '#052521', _light: '#ffffff' } },
        accentAlt: { value: { base: '{colors.teal.200}', _light: '{colors.teal.400}' } },
        border: { value: { base: '{colors.ink.700}', _light: '{colors.ink.200}' } },
        borderStrong: { value: { base: '{colors.ink.600}', _light: '{colors.ink.300}' } },
        field: { value: { base: '{colors.amber.300}', _light: '{colors.amber.300}' } },
        fieldInk: { value: { base: '{colors.amber.900}', _light: '{colors.amber.900}' } },
        fieldInkMuted: { value: { base: '{colors.amber.700}', _light: '{colors.amber.700}' } },
        fieldBorder: { value: { base: '{colors.amber.500}', _light: '{colors.amber.500}' } },
      },
    },
  },
})