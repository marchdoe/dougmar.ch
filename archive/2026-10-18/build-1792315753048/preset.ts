import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      textWrap: 'balance',
      fontWeight: 'inherit',
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
  },
  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        chartreuse: {
          50: { value: '#F6FDE0' },
          100: { value: '#E6FF9E' },
          200: { value: '#D4F56B' },
          300: { value: '#C7EF4C' },
          400: { value: '#B9E532' },
          500: { value: '#A4CF24' },
          600: { value: '#8FB81E' },
          700: { value: '#6E8E16' },
          800: { value: '#4E650F' },
          900: { value: '#2F3C09' },
        },
        ice: {
          50: { value: '#EAF5FC' },
          100: { value: '#C9E6F8' },
          200: { value: '#9BD0F0' },
          300: { value: '#74BAE8' },
          400: { value: '#52A5E0' },
          500: { value: '#3A87C2' },
          600: { value: '#2C6A99' },
          700: { value: '#204E71' },
          800: { value: '#16344C' },
          900: { value: '#0C1E2C' },
        },
        warmblack: {
          50: { value: '#FAFAF2' },
          100: { value: '#F0F0E4' },
          200: { value: '#D9D9C8' },
          300: { value: '#BABAA6' },
          400: { value: '#94947E' },
          500: { value: '#6E6E58' },
          600: { value: '#4E4E3C' },
          700: { value: '#333327' },
          800: { value: '#1C1C13' },
          900: { value: '#0D0D08' },
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
        bg: {
          value: { base: '{colors.warmblack.900}', _light: '{colors.warmblack.50}' },
        },
        bgAlt: {
          value: { base: '{colors.warmblack.800}', _light: '{colors.warmblack.100}' },
        },
        surface: {
          value: { base: '{colors.warmblack.700}', _light: '#FFFFFF' },
        },
        text: {
          value: { base: '{colors.warmblack.50}', _light: '{colors.warmblack.800}' },
        },
        textMuted: {
          value: { base: '{colors.warmblack.300}', _light: '{colors.warmblack.600}' },
        },
        textFaint: {
          value: { base: '{colors.warmblack.400}', _light: '{colors.warmblack.500}' },
        },
        accent: {
          value: { base: '{colors.chartreuse.400}', _light: '{colors.chartreuse.600}' },
        },
        accentText: {
          value: { base: '{colors.warmblack.900}', _light: '{colors.warmblack.50}' },
        },
        accentAlt: {
          value: { base: '{colors.chartreuse.200}', _light: '{colors.chartreuse.700}' },
        },
        border: {
          value: { base: '{colors.warmblack.700}', _light: '{colors.warmblack.200}' },
        },
        borderStrong: {
          value: { base: '{colors.warmblack.600}', _light: '{colors.warmblack.300}' },
        },
        field: {
          value: { base: '{colors.chartreuse.400}', _light: '{colors.chartreuse.400}' },
        },
        fieldInk: {
          value: { base: '{colors.warmblack.900}', _light: '{colors.warmblack.900}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.warmblack.700}', _light: '{colors.warmblack.700}' },
        },
        fieldBorder: {
          value: { base: '{colors.chartreuse.600}', _light: '{colors.chartreuse.600}' },
        },
      },
    },
  },
})