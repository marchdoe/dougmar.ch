import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
      textSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      fontKerning: 'normal',
      fontVariantNumeric: 'oldstyle-nums',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
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
    'blockquote, figure': {
      margin: '0',
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
        oxblood: {
          50: { value: '#fbeeec' },
          100: { value: '#f6dcd7' },
          200: { value: '#ecbab1' },
          300: { value: '#de9185' },
          400: { value: '#cc6a5b' },
          500: { value: '#b44a3b' },
          600: { value: '#9a3729' },
          700: { value: '#7c2a1f' },
          800: { value: '#5f2017' },
          900: { value: '#3f1510' },
        },
        bone: {
          50: { value: '#faf6f0' },
          100: { value: '#f3ece1' },
          200: { value: '#e8ddcc' },
          300: { value: '#d6c7b0' },
          400: { value: '#b8a488' },
          500: { value: '#948066' },
          600: { value: '#6e5e48' },
          700: { value: '#4e4232' },
          800: { value: '#332b20' },
          900: { value: '#1d1812' },
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
        bg: {
          value: { base: '{colors.bone.50}', _light: '{colors.bone.50}' },
        },
        bgAlt: {
          value: { base: '{colors.bone.100}', _light: '{colors.bone.100}' },
        },
        surface: {
          value: { base: '{colors.bone.200}', _light: '{colors.bone.200}' },
        },
        text: {
          value: { base: '{colors.oxblood.900}', _light: '{colors.oxblood.900}' },
        },
        textMuted: {
          value: { base: '{colors.oxblood.700}', _light: '{colors.oxblood.700}' },
        },
        textFaint: {
          value: { base: '{colors.bone.600}', _light: '{colors.bone.600}' },
        },
        accent: {
          value: { base: '{colors.oxblood.600}', _light: '{colors.oxblood.600}' },
        },
        accentText: {
          value: { base: '{colors.bone.50}', _light: '{colors.bone.50}' },
        },
        accentAlt: {
          value: { base: '{colors.oxblood.500}', _light: '{colors.oxblood.500}' },
        },
        border: {
          value: { base: '{colors.bone.300}', _light: '{colors.bone.300}' },
        },
        borderStrong: {
          value: { base: '{colors.oxblood.700}', _light: '{colors.oxblood.700}' },
        },
        field: {
          value: { base: '{colors.oxblood.800}', _light: '{colors.oxblood.800}' },
        },
        fieldInk: {
          value: { base: '{colors.bone.50}', _light: '{colors.bone.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.bone.200}', _light: '{colors.bone.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.oxblood.600}', _light: '{colors.oxblood.600}' },
        },
      },
    },
  },
})