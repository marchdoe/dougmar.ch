import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      fontOpticalSizing: 'auto',
      WebkitFontSmoothing: 'antialiased',
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
        brass: {
          50: { value: '#f7f5e2' },
          100: { value: '#ece9cf' },
          200: { value: '#ddd9a7' },
          300: { value: '#c3c66e' },
          400: { value: '#a7ab4a' },
          500: { value: '#868a30' },
          600: { value: '#656a21' },
          700: { value: '#50541a' },
          800: { value: '#3f4313' },
          900: { value: '#272a0c' },
        },
        gold: {
          50: { value: '#fdf8e4' },
          100: { value: '#fbefc0' },
          200: { value: '#f6e08c' },
          300: { value: '#efcb52' },
          400: { value: '#ecc53d' },
          500: { value: '#d4a92c' },
          600: { value: '#b08a1f' },
          700: { value: '#8a6b16' },
          800: { value: '#6a510f' },
          900: { value: '#463508' },
        },
        neutral: {
          50: { value: '#f8f7ef' },
          100: { value: '#ececdf' },
          200: { value: '#d8d8c4' },
          300: { value: '#bdbda3' },
          400: { value: '#9c9c7f' },
          500: { value: '#7b7b60' },
          600: { value: '#5f5f49' },
          700: { value: '#464636' },
          800: { value: '#2f2f23' },
          900: { value: '#1c1c14' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '1px' },
        md: { value: '2px' },
        lg: { value: '4px' },
        full: { value: '9999px' },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          value: { base: '{colors.brass.700}', _light: '{colors.brass.50}' },
        },
        bgAlt: {
          value: { base: '{colors.brass.800}', _light: '{colors.brass.100}' },
        },
        surface: {
          value: { base: '{colors.brass.600}', _light: '{colors.neutral.50}' },
        },
        text: {
          value: { base: '{colors.brass.50}', _light: '{colors.brass.900}' },
        },
        textMuted: {
          value: { base: '{colors.brass.200}', _light: '{colors.brass.700}' },
        },
        textFaint: {
          value: { base: '{colors.brass.300}', _light: '{colors.brass.600}' },
        },
        accent: {
          value: { base: '{colors.gold.400}', _light: '{colors.gold.700}' },
        },
        accentText: {
          value: { base: '{colors.brass.900}', _light: '{colors.brass.50}' },
        },
        accentAlt: {
          value: { base: '{colors.gold.600}', _light: '{colors.gold.800}' },
        },
        border: {
          value: { base: '{colors.brass.600}', _light: '{colors.brass.200}' },
        },
        borderStrong: {
          value: { base: '{colors.brass.400}', _light: '{colors.brass.400}' },
        },
        field: {
          value: { base: '{colors.brass.900}', _light: '{colors.brass.900}' },
        },
        fieldInk: {
          value: { base: '{colors.brass.50}', _light: '{colors.brass.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.brass.200}', _light: '{colors.brass.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.brass.500}', _light: '{colors.brass.500}' },
        },
      },
    },
  },
})