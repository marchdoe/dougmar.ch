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
    'p': {
      margin: 0,
      textWrap: 'pretty',
    },
    'a': {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
      textDecorationColor: 'accent',
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
        gold: {
          50: { value: '#FDF6E3' },
          100: { value: '#FBEBC0' },
          200: { value: '#F7DD8E' },
          300: { value: '#F2C94C' },
          400: { value: '#E0A82E' },
          500: { value: '#C08A1E' },
          600: { value: '#A9741A' },
          700: { value: '#7E5514' },
          800: { value: '#533810' },
          900: { value: '#2E1F0A' },
        },
        sand: {
          50: { value: '#FBF9F3' },
          100: { value: '#F4F0E6' },
          200: { value: '#E8E2D2' },
          300: { value: '#CFC6AE' },
          400: { value: '#A89E7E' },
          500: { value: '#7A7158' },
          600: { value: '#5E5744' },
          700: { value: '#45402F' },
          800: { value: '#2B2416' },
          900: { value: '#16130B' },
        },
        ink: {
          900: { value: '#1C1810' },
          50: { value: '#F6F1E4' },
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
        bg: { value: { base: '{colors.sand.900}', _light: '{colors.sand.50}' } },
        bgAlt: { value: { base: '{colors.sand.800}', _light: '{colors.sand.100}' } },
        surface: { value: { base: '#2B2416', _light: '#FFFFFF' } },
        text: { value: { base: '{colors.ink.50}', _light: '{colors.ink.900}' } },
        textMuted: { value: { base: '#BDB393', _light: '{colors.sand.600}' } },
        textFaint: { value: { base: '#8E8468', _light: '{colors.sand.500}' } },
        accent: { value: { base: '{colors.gold.400}', _light: '{colors.gold.400}' } },
        accentText: { value: { base: '{colors.ink.900}', _light: '{colors.ink.900}' } },
        accentAlt: { value: { base: '{colors.gold.300}', _light: '{colors.gold.600}' } },
        border: { value: { base: '#3A3320', _light: '{colors.sand.200}' } },
        borderStrong: { value: { base: '{colors.sand.600}', _light: '{colors.sand.400}' } },
        field: { value: { base: '{colors.gold.400}', _light: '{colors.gold.400}' } },
        fieldInk: { value: { base: '{colors.ink.900}', _light: '{colors.ink.900}' } },
        fieldInkMuted: { value: { base: '{colors.gold.800}', _light: '{colors.gold.800}' } },
        fieldBorder: { value: { base: '{colors.gold.600}', _light: '{colors.gold.600}' } },
      },
    },
  },
})