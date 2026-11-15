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
      textRendering: 'optimizeLegibility',
      fontFeatureSettings: '"kern", "liga"',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      color: 'inherit',
      textWrap: 'balance',
    },
    p: {
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
        garnet: {
          50: { value: '#FCEBEE' },
          100: { value: '#F9D2D8' },
          200: { value: '#F0A3AE' },
          300: { value: '#E3707F' },
          400: { value: '#D24355' },
          500: { value: '#B52537' },
          600: { value: '#991B2C' },
          700: { value: '#7A1526' },
          800: { value: '#5C0F1D' },
          900: { value: '#400A14' },
        },
        sand: {
          50: { value: '#FBF4F1' },
          100: { value: '#F3E7E3' },
          200: { value: '#E5D0CB' },
          300: { value: '#CDB1AC' },
          400: { value: '#AC847F' },
          500: { value: '#845C58' },
          600: { value: '#63423F' },
          700: { value: '#472E2C' },
          800: { value: '#2F1D1D' },
          900: { value: '#1D1011' },
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
        bg: { value: '{colors.garnet.700}' },
        bgAlt: { value: '{colors.garnet.800}' },
        surface: { value: '{colors.garnet.500}' },
        text: { value: '{colors.sand.50}' },
        textMuted: { value: '{colors.garnet.100}' },
        textFaint: { value: '{colors.garnet.200}' },
        accent: { value: '{colors.garnet.300}' },
        accentText: { value: '{colors.garnet.900}' },
        accentAlt: { value: '{colors.garnet.200}' },
        border: { value: '{colors.garnet.600}' },
        borderStrong: { value: '{colors.garnet.400}' },
        field: { value: '{colors.garnet.600}' },
        fieldInk: { value: '{colors.sand.50}' },
        fieldInkMuted: { value: '{colors.garnet.100}' },
        fieldBorder: { value: '{colors.garnet.400}' },
      },
    },
  },
})