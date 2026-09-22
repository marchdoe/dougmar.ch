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
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'h1, h2, h3, h4, h5, h6, p, figure, blockquote': {
      margin: 0,
    },
    'h1, h2, h3': {
      textWrap: 'balance',
    },
    'article p, .prose p': {
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
        rose: {
          50: { value: '#FCEDF1' },
          100: { value: '#F9D9E2' },
          200: { value: '#F0B0C4' },
          300: { value: '#E483A2' },
          400: { value: '#D25680' },
          500: { value: '#B93764' },
          600: { value: '#9C2A53' },
          700: { value: '#7C2140' },
          800: { value: '#5A1730' },
          900: { value: '#380E1E' },
        },
        gold: {
          50: { value: '#FCF6E7' },
          100: { value: '#F9ECC7' },
          200: { value: '#F2DA95' },
          300: { value: '#EAC868' },
          400: { value: '#DFB13B' },
          500: { value: '#C8942A' },
          600: { value: '#A5771E' },
          700: { value: '#7E5A18' },
          800: { value: '#573E14' },
          900: { value: '#33260E' },
        },
        warm: {
          50: { value: '#FAF5F5' },
          100: { value: '#F1E9E9' },
          200: { value: '#E1D4D5' },
          300: { value: '#C7B4B6' },
          400: { value: '#A18B8D' },
          500: { value: '#7B6668' },
          600: { value: '#5C4A4C' },
          700: { value: '#423436' },
          800: { value: '#2B2122' },
          900: { value: '#191113' },
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
        bg: { value: { base: '{colors.gold.200}' } },
        bgAlt: { value: { base: '{colors.gold.300}' } },
        surface: { value: { base: '{colors.gold.50}' } },
        text: { value: { base: '{colors.rose.900}' } },
        textMuted: { value: { base: '{colors.rose.800}' } },
        textFaint: { value: { base: '{colors.warm.600}' } },
        accent: { value: { base: '{colors.rose.500}' } },
        accentText: { value: { base: '{colors.rose.50}' } },
        accentAlt: { value: { base: '{colors.rose.600}' } },
        border: { value: { base: '{colors.gold.500}' } },
        borderStrong: { value: { base: '{colors.rose.700}' } },
        field: { value: { base: '{colors.rose.700}' } },
        fieldInk: { value: { base: '{colors.rose.50}' } },
        fieldInkMuted: { value: { base: '{colors.gold.300}' } },
        fieldBorder: { value: { base: '{colors.rose.600}' } },
      },
    },
  },
})