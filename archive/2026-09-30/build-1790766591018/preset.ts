import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      padding: 0,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
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
    'p, li, blockquote': {
      maxWidth: '68ch',
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
        teal: {
          50: { value: '#eafaf9' },
          100: { value: '#cbf0ee' },
          200: { value: '#9fe0dd' },
          300: { value: '#6bc8c6' },
          400: { value: '#3ba7a8' },
          500: { value: '#1f8589' },
          600: { value: '#146a70' },
          700: { value: '#10555c' },
          800: { value: '#0d434a' },
          850: { value: '#0a373d' },
          900: { value: '#082e34' },
        },
        amber: {
          50: { value: '#fdf6e3' },
          100: { value: '#fae9bd' },
          200: { value: '#f5d585' },
          300: { value: '#eebf4e' },
          400: { value: '#e5a92a' },
          500: { value: '#c78a17' },
          600: { value: '#9e6b10' },
          700: { value: '#78500e' },
          800: { value: '#543810' },
          900: { value: '#33230a' },
        },
        neutral: {
          50: { value: '#f3f8f7' },
          100: { value: '#e4efee' },
          200: { value: '#c8dad9' },
          300: { value: '#a3bab9' },
          400: { value: '#758c8b' },
          500: { value: '#526462' },
          600: { value: '#3d4d4b' },
          700: { value: '#2c3937' },
          800: { value: '#1d2827' },
          900: { value: '#101817' },
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
        bg: {
          value: { base: '{colors.teal.800}', _light: '{colors.teal.50}' },
        },
        bgAlt: {
          value: { base: '{colors.teal.850}', _light: '{colors.teal.100}' },
        },
        surface: {
          value: { base: '{colors.teal.700}', _light: '{colors.neutral.50}' },
        },
        text: {
          value: { base: '{colors.teal.50}', _light: '{colors.teal.900}' },
        },
        textMuted: {
          value: { base: '{colors.teal.200}', _light: '{colors.teal.700}' },
        },
        textFaint: {
          value: { base: '{colors.teal.300}', _light: '{colors.teal.600}' },
        },
        accent: {
          value: { base: '{colors.amber.400}', _light: '{colors.amber.500}' },
        },
        accentText: {
          value: { base: '{colors.teal.900}', _light: '{colors.teal.50}' },
        },
        accentAlt: {
          value: { base: '{colors.amber.300}', _light: '{colors.amber.400}' },
        },
        border: {
          value: { base: '{colors.teal.600}', _light: '{colors.teal.200}' },
        },
        borderStrong: {
          value: { base: '{colors.teal.400}', _light: '{colors.teal.400}' },
        },
        field: {
          value: { base: '{colors.teal.900}', _light: '{colors.teal.800}' },
        },
        fieldInk: {
          value: { base: '{colors.teal.50}', _light: '{colors.teal.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.teal.200}', _light: '{colors.teal.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.teal.500}', _light: '{colors.teal.600}' },
        },
      },
    },
  },
})