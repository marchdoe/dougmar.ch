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
      margin: 0,
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
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 140ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    hr: {
      border: 'none',
      borderTop: '1px solid',
      borderColor: 'border',
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
        teal: {
          50: { value: '#e6faf3' },
          100: { value: '#c3f3e3' },
          200: { value: '#92e8cd' },
          300: { value: '#5bd9b2' },
          400: { value: '#2ecf9d' },
          500: { value: '#16b083' },
          600: { value: '#0e8e69' },
          700: { value: '#0c6f53' },
          800: { value: '#0d5642' },
          900: { value: '#0a3a2d' },
        },
        ink: {
          50: { value: '#eef4f2' },
          100: { value: '#d7e2de' },
          200: { value: '#b3c6c0' },
          300: { value: '#8aa39b' },
          400: { value: '#647d75' },
          500: { value: '#48605a' },
          600: { value: '#344944' },
          700: { value: '#223531' },
          800: { value: '#142320' },
          900: { value: '#0a1512' },
        },
        void: {
          900: { value: '#06110f' },
          800: { value: '#0a1a16' },
          700: { value: '#0f2620' },
          600: { value: '#0d3a2c' },
          500: { value: '#1f5142' },
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
          value: { base: '{colors.void.900}', _light: '{colors.ink.50}' },
        },
        bgAlt: {
          value: { base: '{colors.void.800}', _light: '{colors.ink.100}' },
        },
        surface: {
          value: { base: '{colors.void.700}', _light: '#ffffff' },
        },
        text: {
          value: { base: '#e8f4ef', _light: '{colors.ink.900}' },
        },
        textMuted: {
          value: { base: '#9dbdb2', _light: '{colors.ink.600}' },
        },
        textFaint: {
          value: { base: '#7f9f94', _light: '{colors.ink.500}' },
        },
        accent: {
          value: { base: '{colors.teal.400}', _light: '{colors.teal.600}' },
        },
        accentText: {
          value: { base: '#06201b', _light: '#ffffff' },
        },
        accentAlt: {
          value: { base: '{colors.teal.200}', _light: '{colors.teal.500}' },
        },
        border: {
          value: { base: '{colors.void.500}', _light: '{colors.ink.200}' },
        },
        borderStrong: {
          value: { base: '#3a6d5c', _light: '{colors.ink.400}' },
        },
        field: {
          value: { base: '{colors.void.600}', _light: '{colors.void.600}' },
        },
        fieldInk: {
          value: { base: '#d8efe6', _light: '#d8efe6' },
        },
        fieldInkMuted: {
          value: { base: '#86b4a5', _light: '#86b4a5' },
        },
        fieldBorder: {
          value: { base: '#1f5142', _light: '#1f5142' },
        },
      },
    },
  },
})