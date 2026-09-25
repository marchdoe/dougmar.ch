import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
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
        green: {
          50: { value: '#E9F6EE' },
          100: { value: '#C9EAD5' },
          200: { value: '#98D6B0' },
          300: { value: '#5FBB86' },
          400: { value: '#2E9E62' },
          500: { value: '#158048' },
          600: { value: '#0F6B3B' },
          700: { value: '#0C5730' },
          800: { value: '#084324' },
          900: { value: '#052C17' },
        },
        marigold: {
          50: { value: '#FEF6E2' },
          100: { value: '#FDE9B4' },
          200: { value: '#FBD97F' },
          300: { value: '#F9C74B' },
          400: { value: '#F2B535' },
          500: { value: '#E09E1C' },
          600: { value: '#BC8114' },
          700: { value: '#966311' },
          800: { value: '#6E480E' },
          900: { value: '#452C08' },
        },
        sage: {
          50: { value: '#F4F5EC' },
          100: { value: '#E6E9DC' },
          200: { value: '#CBD2BE' },
          300: { value: '#A9B49B' },
          400: { value: '#7F8C71' },
          500: { value: '#5C6A50' },
          600: { value: '#45513B' },
          700: { value: '#333D2C' },
          800: { value: '#232B1E' },
          900: { value: '#151A11' },
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
        bg: { value: { base: '{colors.green.700}' } },
        bgAlt: { value: { base: '{colors.green.800}' } },
        surface: { value: { base: '{colors.green.600}' } },
        text: { value: { base: '{colors.sage.50}' } },
        textMuted: { value: { base: '#BFCBB2' } },
        textFaint: { value: { base: '#93A188' } },
        accent: { value: { base: '{colors.marigold.400}' } },
        accentText: { value: { base: '{colors.green.900}' } },
        accentAlt: { value: { base: '{colors.marigold.300}' } },
        border: { value: { base: '#1A6E3F' } },
        borderStrong: { value: { base: '{colors.green.400}' } },
        field: { value: { base: '{colors.green.700}' } },
        fieldInk: { value: { base: '{colors.sage.50}' } },
        fieldInkMuted: { value: { base: '#BFCBB2' } },
        fieldBorder: { value: { base: '#22794A' } },
      },
    },
  },
})