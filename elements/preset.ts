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
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
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
        teal: {
          50: { value: '#f2f5f4' },
          100: { value: '#d7e9e4' },
          200: { value: '#b2d2c9' },
          300: { value: '#84b5a8' },
          400: { value: '#589485' },
          500: { value: '#3c7a6a' },
          600: { value: '#2f6153' },
          700: { value: '#274f44' },
          800: { value: '#203f37' },
          900: { value: '#17302a' },
        },
        mint: {
          50: { value: '#eafaf4' },
          100: { value: '#c9f2e4' },
          200: { value: '#9fe8d4' },
          300: { value: '#6fdcbf' },
          400: { value: '#45cfa8' },
          500: { value: '#26b48c' },
          600: { value: '#1f9476' },
          700: { value: '#1d7760' },
          800: { value: '#1b5d4c' },
          900: { value: '#164a3d' },
        },
        neutral: {
          50: { value: '#f2f5f4' },
          100: { value: '#e3e9e7' },
          200: { value: '#c8d2cf' },
          300: { value: '#a3b0ac' },
          400: { value: '#7c8a86' },
          500: { value: '#5d6b67' },
          600: { value: '#475450' },
          700: { value: '#38423f' },
          800: { value: '#2a3230' },
          900: { value: '#1b211f' },
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
        bg: { value: { base: '{colors.teal.800}', _light: '{colors.teal.50}' } },
        bgAlt: { value: { base: '{colors.teal.900}', _light: '{colors.teal.100}' } },
        surface: { value: { base: '{colors.teal.700}', _light: '{colors.neutral.50}' } },
        text: { value: { base: '{colors.teal.50}', _light: '{colors.teal.900}' } },
        textMuted: { value: { base: '{colors.teal.200}', _light: '{colors.teal.600}' } },
        textFaint: { value: { base: '{colors.teal.300}', _light: '{colors.teal.500}' } },
        accent: { value: { base: '{colors.mint.400}', _light: '{colors.mint.700}' } },
        accentText: { value: { base: '{colors.teal.900}', _light: '{colors.teal.50}' } },
        accentAlt: { value: { base: '{colors.mint.200}', _light: '{colors.mint.300}' } },
        border: { value: { base: '{colors.teal.600}', _light: '{colors.teal.200}' } },
        borderStrong: { value: { base: '{colors.teal.400}', _light: '{colors.teal.400}' } },
        field: { value: { base: '{colors.teal.900}', _light: '{colors.teal.700}' } },
        fieldInk: { value: { base: '{colors.teal.50}', _light: '{colors.teal.50}' } },
        fieldInkMuted: { value: { base: '{colors.teal.200}', _light: '{colors.teal.200}' } },
        fieldBorder: { value: { base: '{colors.teal.600}', _light: '{colors.teal.600}' } },
      },
    },
  },
})