import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    ':root': {
      colorScheme: 'dark',
    },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontVariantNumeric: 'tabular-nums',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
      margin: 0,
    },
    a: {
      color: 'inherit',
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

  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },

  theme: {
    tokens: {
      colors: {
        amber: {
          50: { value: '#fdf7ea' },
          100: { value: '#f9ebc6' },
          200: { value: '#f2d894' },
          300: { value: '#e8bd5c' },
          400: { value: '#dda233' },
          500: { value: '#c98a1e' },
          600: { value: '#a56e14' },
          700: { value: '#7f5413' },
          800: { value: '#593b12' },
          900: { value: '#38260f' },
        },
        marigold: {
          50: { value: '#fff4dd' },
          100: { value: '#ffe6b0' },
          200: { value: '#ffd47a' },
          300: { value: '#fbbf47' },
          400: { value: '#f2a91f' },
          500: { value: '#d98c12' },
          600: { value: '#b56e0e' },
          700: { value: '#8f530d' },
          800: { value: '#6b3e0f' },
          900: { value: '#482a0d' },
        },
        sand: {
          50: { value: '#f8f3ea' },
          100: { value: '#ece2d2' },
          200: { value: '#d6c8b0' },
          300: { value: '#b7a488' },
          400: { value: '#8f7c5e' },
          500: { value: '#6a5940' },
          600: { value: '#4c3f2b' },
          700: { value: '#362c1d' },
          800: { value: '#241c10' },
          900: { value: '#17110a' },
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
        bg: { value: '{colors.amber.400}' },
        bgAlt: { value: '{colors.amber.500}' },
        surface: { value: '{colors.amber.300}' },
        text: { value: '{colors.sand.900}' },
        textMuted: { value: '{colors.sand.700}' },
        textFaint: { value: '{colors.sand.600}' },
        accent: { value: '{colors.marigold.400}' },
        accentText: { value: '{colors.sand.900}' },
        accentAlt: { value: '{colors.marigold.200}' },
        border: { value: '{colors.amber.600}' },
        borderStrong: { value: '{colors.amber.700}' },
        field: { value: '{colors.sand.900}' },
        fieldInk: { value: '{colors.amber.100}' },
        fieldInkMuted: { value: '{colors.sand.300}' },
        fieldBorder: { value: '{colors.sand.700}' },
      },
    },
  },
})