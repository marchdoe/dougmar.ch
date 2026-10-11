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
      textDecorationColor: 'accent',
      textUnderlineOffset: '0.18em',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '2px',
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
        rust: {
          50: { value: '#FBF1E9' },
          100: { value: '#F6E0D1' },
          200: { value: '#ECC6AE' },
          300: { value: '#E0A585' },
          400: { value: '#CE7D54' },
          500: { value: '#B85733' },
          600: { value: '#8E3B1E' },
          700: { value: '#74301A' },
          800: { value: '#5A2413' },
          900: { value: '#3A1710' },
        },
        ember: {
          50: { value: '#FDF0E4' },
          100: { value: '#FADBC0' },
          200: { value: '#F6C095' },
          300: { value: '#F3A866' },
          400: { value: '#F08A3C' },
          500: { value: '#DE6F1E' },
          600: { value: '#BE5714' },
          700: { value: '#984413' },
          800: { value: '#6E3210' },
          900: { value: '#44200B' },
        },
        sand: {
          50: { value: '#FAF4EF' },
          100: { value: '#F0E7DF' },
          200: { value: '#E0D2C6' },
          300: { value: '#C8B4A6' },
          400: { value: '#A89080' },
          500: { value: '#88705F' },
          600: { value: '#6A5345' },
          700: { value: '#4E3B30' },
          800: { value: '#33251D' },
          900: { value: '#1E1511' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '1px' },
        md: { value: '2px' },
        lg: { value: '4px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: '{colors.rust.600}' },
        bgAlt: { value: '{colors.rust.800}' },
        surface: { value: '{colors.rust.700}' },
        text: { value: '{colors.rust.50}' },
        textMuted: { value: '{colors.rust.200}' },
        textFaint: { value: '{colors.rust.300}' },
        accent: { value: '{colors.ember.400}' },
        accentText: { value: '{colors.rust.900}' },
        accentAlt: { value: '{colors.ember.200}' },
        border: { value: '{colors.rust.500}' },
        borderStrong: { value: '{colors.rust.400}' },
        field: { value: '{colors.rust.900}' },
        fieldInk: { value: '{colors.rust.50}' },
        fieldInkMuted: { value: '{colors.rust.200}' },
        fieldBorder: { value: '{colors.ember.800}' },
      },
    },
  },
})