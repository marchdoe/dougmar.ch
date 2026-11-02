import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      fontOpticalSizing: 'auto',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
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
          50: { value: '#E9FBF0' },
          100: { value: '#C6F6DC' },
          200: { value: '#8EECB9' },
          300: { value: '#57DF95' },
          400: { value: '#2FCB7B' },
          500: { value: '#1FAE66' },
          600: { value: '#178A51' },
          700: { value: '#136E42' },
          800: { value: '#0E4D2F' },
          900: { value: '#0A2E1D' },
        },
        neutral: {
          50: { value: '#EDF4EF' },
          100: { value: '#DCE8E0' },
          200: { value: '#BACCC0' },
          300: { value: '#9BB4A4' },
          400: { value: '#789585' },
          500: { value: '#51665A' },
          600: { value: '#35463B' },
          700: { value: '#202E25' },
          800: { value: '#152019' },
          900: { value: '#0B130E' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '4px' },
        lg: { value: '10px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.neutral.900}' } },
        bgAlt: { value: { base: '{colors.neutral.800}' } },
        surface: { value: { base: '{colors.neutral.700}' } },
        text: { value: { base: '{colors.neutral.50}' } },
        textMuted: { value: { base: '{colors.neutral.300}' } },
        textFaint: { value: { base: '{colors.neutral.400}' } },
        accent: { value: { base: '{colors.green.400}' } },
        accentText: { value: { base: '{colors.neutral.900}' } },
        accentAlt: { value: { base: '{colors.green.300}' } },
        border: { value: { base: '{colors.neutral.700}' } },
        borderStrong: { value: { base: '{colors.neutral.500}' } },
        field: { value: { base: '{colors.green.700}' } },
        fieldInk: { value: { base: '{colors.neutral.50}' } },
        fieldInkMuted: { value: { base: '{colors.green.100}' } },
        fieldBorder: { value: { base: '{colors.green.900}' } },
      },
    },
  },
})