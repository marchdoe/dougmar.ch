import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      fontKerning: 'normal',
      fontFeatureSettings: '"kern", "liga"',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      margin: '0',
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'blockquote': {
      margin: '0',
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
        wine: {
          50: { value: '#faf4f5' },
          100: { value: '#f6dae1' },
          200: { value: '#ecb3c2' },
          300: { value: '#de8699' },
          400: { value: '#cc5c77' },
          500: { value: '#ad3a58' },
          600: { value: '#8c2a44' },
          700: { value: '#6a1f33' },
          800: { value: '#4a1524' },
          900: { value: '#2e0d17' },
        },
        rose: {
          50: { value: '#fef0f3' },
          100: { value: '#fcdce3' },
          200: { value: '#f7b9c8' },
          300: { value: '#f094a9' },
          400: { value: '#e5708c' },
          500: { value: '#d44e70' },
          600: { value: '#b23659' },
          700: { value: '#8a2745' },
          800: { value: '#611c31' },
          900: { value: '#3c121f' },
        },
        neutral: {
          50: { value: '#faf4f5' },
          100: { value: '#f0e6e8' },
          200: { value: '#ddccd0' },
          300: { value: '#c3aeb4' },
          400: { value: '#9c838b' },
          500: { value: '#766069' },
          600: { value: '#574650' },
          700: { value: '#3d3038' },
          800: { value: '#271e24' },
          900: { value: '#170f13' },
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
        bg: {
          value: { base: '{colors.wine.800}', _light: '{colors.wine.50}' },
        },
        bgAlt: {
          value: { base: '{colors.wine.900}', _light: '{colors.wine.100}' },
        },
        surface: {
          value: { base: '{colors.wine.700}', _light: '{colors.neutral.50}' },
        },
        text: {
          value: { base: '{colors.neutral.50}', _light: '{colors.wine.900}' },
        },
        textMuted: {
          value: { base: '{colors.neutral.200}', _light: '{colors.wine.700}' },
        },
        textFaint: {
          value: { base: '{colors.neutral.300}', _light: '{colors.wine.600}' },
        },
        accent: {
          value: { base: '{colors.rose.400}', _light: '{colors.rose.600}' },
        },
        accentText: {
          value: { base: '{colors.wine.900}', _light: '{colors.wine.50}' },
        },
        accentAlt: {
          value: { base: '{colors.rose.200}', _light: '{colors.rose.700}' },
        },
        border: {
          value: { base: '{colors.wine.700}', _light: '{colors.wine.200}' },
        },
        borderStrong: {
          value: { base: '{colors.wine.400}', _light: '{colors.wine.600}' },
        },
        field: {
          value: { base: '{colors.wine.700}', _light: '{colors.wine.500}' },
        },
        fieldInk: {
          value: { base: '{colors.neutral.50}', _light: '{colors.neutral.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.neutral.200}', _light: '{colors.neutral.100}' },
        },
        fieldBorder: {
          value: { base: '{colors.wine.400}', _light: '{colors.wine.300}' },
        },
      },
    },
  },
})