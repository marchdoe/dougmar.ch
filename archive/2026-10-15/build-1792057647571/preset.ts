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
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      textWrap: 'balance',
    },
    p: {
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
        jade: {
          50: { value: '#e9f7f0' },
          100: { value: '#c6ebda' },
          200: { value: '#92d9b9' },
          300: { value: '#57c094' },
          400: { value: '#27a675' },
          500: { value: '#0f8a5e' },
          600: { value: '#0b6e4b' },
          700: { value: '#0a5940' },
          800: { value: '#0a4330' },
          900: { value: '#092f23' },
        },
        gold: {
          50: { value: '#fdf6e4' },
          100: { value: '#fbe9bd' },
          200: { value: '#f8d888' },
          300: { value: '#f5c659' },
          400: { value: '#f2b134' },
          500: { value: '#d9971f' },
          600: { value: '#b67c14' },
          700: { value: '#8f610f' },
          800: { value: '#6b480c' },
          900: { value: '#4a3108' },
        },
        sage: {
          50: { value: '#f4f8f6' },
          100: { value: '#e6efea' },
          200: { value: '#ceddd4' },
          300: { value: '#afc3b8' },
          400: { value: '#89a396' },
          500: { value: '#6a8477' },
          600: { value: '#516a5e' },
          700: { value: '#3d5147' },
          800: { value: '#293930' },
          900: { value: '#15221c' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '3px' },
        md: { value: '6px' },
        lg: { value: '10px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.jade.600}' } },
        bgAlt: { value: { base: '{colors.jade.700}' } },
        surface: { value: { base: '{colors.jade.800}' } },
        text: { value: { base: '#f1fbf6' } },
        textMuted: { value: { base: '#b6e3cf' } },
        textFaint: { value: { base: '#9bd2b8' } },
        accent: { value: { base: '{colors.gold.400}' } },
        accentText: { value: { base: '{colors.jade.900}' } },
        accentAlt: { value: { base: '{colors.gold.300}' } },
        border: { value: { base: '#15825a' } },
        borderStrong: { value: { base: '{colors.jade.400}' } },
        field: { value: { base: '{colors.jade.800}' } },
        fieldInk: { value: { base: '#f1fbf6' } },
        fieldInkMuted: { value: { base: '#9bd2b8' } },
        fieldBorder: { value: { base: '#136a49' } },
      },
    },
  },
})