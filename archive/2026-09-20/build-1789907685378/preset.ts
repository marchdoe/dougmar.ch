import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontVariantNumeric: 'tabular-nums',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
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
        teal: {
          50: { value: '#e9fbf6' },
          100: { value: '#c7f4e8' },
          200: { value: '#96ecd9' },
          300: { value: '#5eead4' },
          400: { value: '#2dd4bf' },
          500: { value: '#14b8a6' },
          600: { value: '#0d9488' },
          700: { value: '#0b6f66' },
          800: { value: '#0b3d38' },
          900: { value: '#072623' },
        },
        void: {
          50: { value: '#edf3f2' },
          100: { value: '#dce6e4' },
          200: { value: '#b8ccc9' },
          300: { value: '#8ba8a4' },
          400: { value: '#6f8a85' },
          500: { value: '#3d5854' },
          600: { value: '#2a403d' },
          700: { value: '#1a2b29' },
          800: { value: '#0f1c1a' },
          900: { value: '#081210' },
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
        bg: { value: '#081412' },
        bgAlt: { value: '#0d1c19' },
        surface: { value: '#10201d' },
        text: { value: '#e6efed' },
        textMuted: { value: '#9db5b0' },
        textFaint: { value: '#6f8a85' },
        accent: { value: '{colors.teal.400}' },
        accentText: { value: '#05201c' },
        accentAlt: { value: '{colors.teal.500}' },
        border: { value: '#1e332f' },
        borderStrong: { value: '#2f4a45' },
        field: { value: '{colors.teal.800}' },
        fieldInk: { value: '#d6f5ef' },
        fieldInkMuted: { value: '#7fbfb6' },
        fieldBorder: { value: '#1a5a52' },
      },
    },
  },
})