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
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
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
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease, text-decoration-color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
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
        neutral: {
          50: { value: '#FAFBF5' },
          100: { value: '#F2F4EA' },
          200: { value: '#E6E9D9' },
          300: { value: '#D3D8C3' },
          400: { value: '#ADB49B' },
          500: { value: '#868D74' },
          600: { value: '#656B54' },
          700: { value: '#4A4F3D' },
          800: { value: '#2A2E22' },
          900: { value: '#1B1E14' },
        },
        primary: {
          50: { value: '#F1F8E5' },
          100: { value: '#E0F0C6' },
          200: { value: '#C6E39A' },
          300: { value: '#A8D369' },
          400: { value: '#87C03E' },
          500: { value: '#69A424' },
          600: { value: '#538417' },
          700: { value: '#3F6B0F' },
          800: { value: '#2E4F0A' },
          900: { value: '#213A08' },
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
        bg: { value: { base: '{colors.neutral.50}' } },
        bgAlt: { value: { base: '{colors.primary.50}' } },
        surface: { value: { base: '{colors.neutral.100}' } },
        text: { value: { base: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.700}' } },
        textFaint: { value: { base: '{colors.neutral.600}' } },
        accent: { value: { base: '{colors.primary.700}' } },
        accentText: { value: { base: '{colors.neutral.50}' } },
        accentAlt: { value: { base: '{colors.primary.400}' } },
        border: { value: { base: '{colors.neutral.300}' } },
        borderStrong: { value: { base: '{colors.neutral.500}' } },
        field: { value: { base: '{colors.primary.800}' } },
        fieldInk: { value: { base: '{colors.primary.50}' } },
        fieldInkMuted: { value: { base: '{colors.primary.200}' } },
        fieldBorder: { value: { base: '{colors.primary.600}' } },
      },
    },
  },
})