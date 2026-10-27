import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'h1': {
      fontStyle: 'italic',
    },
    'p': {
      textWrap: 'pretty',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
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
        lime: {
          50: { value: '#f4fae0' },
          100: { value: '#e8f4c8' },
          200: { value: '#d9ed9e' },
          300: { value: '#c9e675' },
          400: { value: '#bfe36a' },
          500: { value: '#a6d24a' },
          600: { value: '#88b733' },
          700: { value: '#6a9622' },
          800: { value: '#4f7018' },
          900: { value: '#35490f' },
        },
        grass: {
          50: { value: '#eef6d8' },
          100: { value: '#dcefb6' },
          200: { value: '#bfe285' },
          300: { value: '#9ccd54' },
          400: { value: '#6fa32b' },
          500: { value: '#5e9e22' },
          600: { value: '#4f8a18' },
          700: { value: '#3e6f12' },
          800: { value: '#2f540e' },
          900: { value: '#213b0a' },
        },
        spruce: {
          50: { value: '#eef4f0' },
          100: { value: '#dce8e1' },
          200: { value: '#bbd2c6' },
          300: { value: '#95b4a4' },
          400: { value: '#6c8e7c' },
          500: { value: '#4c6d5a' },
          600: { value: '#375143' },
          700: { value: '#2a3f34' },
          800: { value: '#1d2e26' },
          900: { value: '#142019' },
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
          value: { base: '{colors.spruce.900}', _light: '{colors.lime.400}' },
        },
        bgAlt: {
          value: { base: '{colors.spruce.800}', _light: '{colors.lime.500}' },
        },
        surface: {
          value: { base: '{colors.spruce.700}', _light: '{colors.lime.50}' },
        },
        text: {
          value: { base: '{colors.lime.100}', _light: '{colors.spruce.900}' },
        },
        textMuted: {
          value: { base: '{colors.spruce.300}', _light: '{colors.spruce.600}' },
        },
        textFaint: {
          value: { base: '{colors.spruce.400}', _light: '{colors.spruce.500}' },
        },
        accent: {
          value: { base: '{colors.lime.400}', _light: '{colors.grass.600}' },
        },
        accentText: {
          value: { base: '{colors.spruce.900}', _light: '{colors.lime.50}' },
        },
        accentAlt: {
          value: { base: '{colors.lime.300}', _light: '{colors.grass.400}' },
        },
        border: {
          value: { base: '{colors.spruce.700}', _light: '{colors.lime.600}' },
        },
        borderStrong: {
          value: { base: '{colors.spruce.500}', _light: '{colors.spruce.800}' },
        },
        field: {
          value: { base: '{colors.lime.400}', _light: '{colors.spruce.900}' },
        },
        fieldInk: {
          value: { base: '{colors.spruce.900}', _light: '{colors.lime.300}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.spruce.600}', _light: '{colors.spruce.300}' },
        },
        fieldBorder: {
          value: { base: '{colors.lime.600}', _light: '{colors.spruce.600}' },
        },
      },
    },
  },
})