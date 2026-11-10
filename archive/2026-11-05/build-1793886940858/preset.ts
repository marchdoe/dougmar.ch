import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      scrollBehavior: 'smooth',
      WebkitTextSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      fontOpticalSizing: 'auto',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      margin: '0',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'h1, h2, h3': {
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
      margin: '0',
    },
    'p, li, blockquote': {
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
    'svg': {
      display: 'block',
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
        clay: {
          50: { value: '#FBF1EA' },
          100: { value: '#F6DECF' },
          200: { value: '#EDBF9F' },
          300: { value: '#E09A6B' },
          400: { value: '#D2763D' },
          500: { value: '#C45A2E' },
          600: { value: '#A0401E' },
          700: { value: '#7A3217' },
          800: { value: '#5F2914' },
          900: { value: '#3C1A0D' },
        },
        gold: {
          50: { value: '#FFF6E6' },
          100: { value: '#FFE9C4' },
          200: { value: '#FFE3AE' },
          300: { value: '#FFDA96' },
          400: { value: '#FFD27A' },
          500: { value: '#E8B45C' },
          600: { value: '#C98A2E' },
          700: { value: '#9C6A20' },
          800: { value: '#6E4A16' },
          900: { value: '#432C0C' },
        },
        sand: {
          50: { value: '#FAF6F2' },
          100: { value: '#F2E9E0' },
          200: { value: '#E3D6C8' },
          300: { value: '#CBB8A6' },
          400: { value: '#A8927C' },
          500: { value: '#836E58' },
          600: { value: '#635141' },
          700: { value: '#47392D' },
          800: { value: '#2E241B' },
          900: { value: '#1A1310' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '6px' },
        lg: { value: '12px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: { base: '{colors.clay.600}', _light: '#B04722' },
        },
        bgAlt: {
          value: { base: '{colors.clay.800}', _light: '#6E2E16' },
        },
        surface: {
          value: { base: '{colors.clay.700}', _light: '#8E3C1A' },
        },
        text: {
          value: { base: '{colors.clay.50}', _light: '#FDF4EE' },
        },
        textMuted: {
          value: { base: '#F2D9C5', _light: '#F5DECB' },
        },
        textFaint: {
          value: { base: '#E6C2A0', _light: '#E8C6A6' },
        },
        accent: {
          value: { base: '{colors.gold.400}', _light: '{colors.gold.400}' },
        },
        accentText: {
          value: { base: '{colors.clay.800}', _light: '{colors.clay.900}' },
        },
        accentAlt: {
          value: { base: '{colors.gold.500}', _light: '{colors.gold.600}' },
        },
        border: {
          value: { base: '#C06A3E', _light: '#B85A2C' },
        },
        borderStrong: {
          value: { base: '#E6C2A0', _light: '#E8C6A6' },
        },
        field: {
          value: { base: '{colors.clay.500}', _light: '#CE6836' },
        },
        fieldInk: {
          value: { base: '{colors.clay.50}', _light: '{colors.clay.50}' },
        },
        fieldInkMuted: {
          value: { base: '#F2D9C5', _light: '#F6E1CE' },
        },
        fieldBorder: {
          value: { base: '{colors.clay.400}', _light: '#E09A6B' },
        },
      },
    },
  },
})