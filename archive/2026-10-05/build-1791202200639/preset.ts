import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    '*': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 160ms ease, text-decoration-color 160ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      textWrap: 'pretty',
    },
    'figure, blockquote': {
      margin: 0,
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
          50: { value: '#e9f4f2' },
          100: { value: '#c9e6e2' },
          200: { value: '#93cdc6' },
          300: { value: '#57b0a7' },
          400: { value: '#2d9087' },
          500: { value: '#167a71' },
          600: { value: '#0f615a' },
          700: { value: '#0c4c47' },
          800: { value: '#0a3d39' },
          900: { value: '#072e2b' },
        },
        coral: {
          50: { value: '#fbeee6' },
          100: { value: '#f6d6c4' },
          200: { value: '#f2b092' },
          300: { value: '#ea8257' },
          400: { value: '#e05d2d' },
          500: { value: '#c24a1f' },
          600: { value: '#9f3c18' },
          700: { value: '#7c2f13' },
          800: { value: '#5a220e' },
          900: { value: '#3a1609' },
        },
        sand: {
          50: { value: '#faf5ea' },
          100: { value: '#f3ecd9' },
          200: { value: '#ece2cc' },
          300: { value: '#e0d2b4' },
          400: { value: '#cdbb94' },
          500: { value: '#a8906a' },
          600: { value: '#7c6a4b' },
          700: { value: '#574a34' },
          800: { value: '#3a3123' },
          900: { value: '#241e14' },
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
        bg: { value: { base: '{colors.sand.200}' } },
        bgAlt: { value: { base: '{colors.sand.300}' } },
        surface: { value: { base: '{colors.sand.100}' } },
        text: { value: { base: '{colors.teal.800}' } },
        textMuted: { value: { base: '{colors.teal.600}' } },
        textFaint: { value: { base: '{colors.sand.600}' } },
        accent: { value: { base: '{colors.coral.400}' } },
        accentText: { value: { base: '{colors.sand.50}' } },
        accentAlt: { value: { base: '{colors.coral.500}' } },
        border: { value: { base: '{colors.sand.400}' } },
        borderStrong: { value: { base: '{colors.sand.600}' } },
        field: { value: { base: '{colors.teal.800}' } },
        fieldInk: { value: { base: '{colors.sand.50}' } },
        fieldInkMuted: { value: { base: '{colors.teal.200}' } },
        fieldBorder: { value: { base: '{colors.teal.600}' } },
      },
    },
  },
})