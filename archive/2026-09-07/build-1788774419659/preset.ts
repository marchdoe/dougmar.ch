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
      fontVariantNumeric: 'oldstyle-nums',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '0.15em',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: '600',
      textWrap: 'balance',
    },
    'p': {
      margin: '0',
      textWrap: 'pretty',
    },
    'blockquote': {
      margin: '0',
    },
    '.tabular': {
      fontVariantNumeric: 'tabular-nums',
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
        azure: {
          50: { value: '#eef5fd' },
          100: { value: '#d9e8fb' },
          200: { value: '#b4d0f6' },
          300: { value: '#85b2ee' },
          400: { value: '#4a8ae0' },
          500: { value: '#175fc0' },
          600: { value: '#124fa3' },
          700: { value: '#0f4185' },
          800: { value: '#0d3568' },
          900: { value: '#0a2647' },
        },
        neutral: {
          50: { value: '#f8fafc' },
          100: { value: '#eef3f8' },
          200: { value: '#dde5ee' },
          300: { value: '#c4d0dd' },
          400: { value: '#94a3b5' },
          500: { value: '#667487' },
          600: { value: '#495667' },
          700: { value: '#333d4b' },
          800: { value: '#202833' },
          900: { value: '#10161e' },
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
        bg: { value: { base: '{colors.neutral.50}' } },
        bgAlt: { value: { base: '{colors.neutral.100}' } },
        surface: { value: { base: '#ffffff' } },
        text: { value: { base: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.600}' } },
        textFaint: { value: { base: '{colors.neutral.500}' } },
        accent: { value: { base: '{colors.azure.500}' } },
        accentText: { value: { base: '#ffffff' } },
        accentAlt: { value: { base: '{colors.azure.400}' } },
        border: { value: { base: '{colors.neutral.200}' } },
        borderStrong: { value: { base: '{colors.neutral.400}' } },
        field: { value: { base: '{colors.azure.500}' } },
        fieldInk: { value: { base: '#ffffff' } },
        fieldInkMuted: { value: { base: '{colors.azure.100}' } },
        fieldBorder: { value: { base: '{colors.azure.400}' } },
      },
    },
  },
})