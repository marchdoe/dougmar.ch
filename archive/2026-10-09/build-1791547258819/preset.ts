import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
      textSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      padding: '0',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
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
      transition: 'color 160ms ease, background-color 160ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    hr: {
      border: '0',
      borderTop: '1px solid',
      borderColor: 'border',
      margin: '0',
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
    extend: {
      tokens: {
        colors: {
          spruce: {
            50: { value: '#eef4f1' },
            100: { value: '#d9e7e1' },
            200: { value: '#b8d2c8' },
            300: { value: '#8fb7a9' },
            400: { value: '#5f9384' },
            500: { value: '#3d7165' },
            600: { value: '#2c5750' },
            700: { value: '#22433e' },
            800: { value: '#1a332f' },
            900: { value: '#122421' },
          },
          emerald: {
            50: { value: '#e6f6ef' },
            100: { value: '#c3ead9' },
            200: { value: '#92d8bb' },
            300: { value: '#7fd4b8' },
            400: { value: '#4fb391' },
            500: { value: '#1f9c76' },
            600: { value: '#137a5a' },
            700: { value: '#0f6349' },
            800: { value: '#0a4a37' },
            900: { value: '#073127' },
          },
          ash: {
            50: { value: '#f4f6f4' },
            100: { value: '#e7ebe8' },
            200: { value: '#d0d7d2' },
            300: { value: '#aab4ad' },
            400: { value: '#7d8882' },
            500: { value: '#596560' },
            600: { value: '#434d49' },
            700: { value: '#333b38' },
            800: { value: '#232927' },
            900: { value: '#161a18' },
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
          bg: { value: { base: '{colors.spruce.800}' } },
          bgAlt: { value: { base: '{colors.spruce.900}' } },
          surface: { value: { base: '{colors.spruce.700}' } },
          text: { value: { base: '#e9f0ec' } },
          textMuted: { value: { base: '#a9bdb5' } },
          textFaint: { value: { base: '#8fa69c' } },
          accent: { value: { base: '{colors.emerald.500}' } },
          accentText: { value: { base: '#0a1f1a' } },
          accentAlt: { value: { base: '{colors.emerald.400}' } },
          border: { value: { base: '{colors.spruce.600}' } },
          borderStrong: { value: { base: '{colors.spruce.400}' } },
          field: { value: { base: '{colors.spruce.50}' } },
          fieldInk: { value: { base: '#163029' } },
          fieldInkMuted: { value: { base: '#356459' } },
          fieldBorder: { value: { base: '{colors.spruce.200}' } },
        },
      },
    },
  },
})