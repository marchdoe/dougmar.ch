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
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
      },
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
    hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#e9faf0' },
          100: { value: '#c7f2dc' },
          200: { value: '#93e6bd' },
          300: { value: '#57d49b' },
          400: { value: '#28bd7d' },
          500: { value: '#12a86a' },
          600: { value: '#0d8054' },
          700: { value: '#0a6344' },
          800: { value: '#0a4a34' },
          900: { value: '#07311f' },
        },
        accent: {
          50: { value: '#e4fced' },
          100: { value: '#c6ffd9' },
          200: { value: '#93f2b4' },
          300: { value: '#6cec9e' },
          400: { value: '#4ce68a' },
          500: { value: '#28cf6f' },
          600: { value: '#1bb560' },
          700: { value: '#15914d' },
          800: { value: '#0f6d3a' },
          900: { value: '#0a4a28' },
        },
        neutral: {
          50: { value: '#f2f7f3' },
          100: { value: '#e3ece6' },
          200: { value: '#c6d6cc' },
          300: { value: '#a1b4a8' },
          400: { value: '#74887c' },
          500: { value: '#54685b' },
          600: { value: '#405249' },
          700: { value: '#2e3c33' },
          800: { value: '#1e2821' },
          900: { value: '#121a15' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '3px' },
        md: { value: '6px' },
        lg: { value: '12px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '#07311f', _light: '#eef9f1' } },
        bgAlt: { value: { base: '#0a4a34', _light: '#dcf0e2' } },
        surface: { value: { base: '#0c4330', _light: '#ffffff' } },
        text: { value: { base: '#f3f7f4', _light: '#06301e' } },
        textMuted: { value: { base: '#9fc4af', _light: '#2f6b4d' } },
        textFaint: { value: { base: '#7fae92', _light: '#46694f' } },
        accent: { value: { base: '#4ce68a', _light: '#0b7f54' } },
        accentText: { value: { base: '#04261a', _light: '#ffffff' } },
        accentAlt: { value: { base: '#93f2b4', _light: '#12a86a' } },
        border: { value: { base: '#0a6344', _light: '#c0ddc9' } },
        borderStrong: { value: { base: '#12a86a', _light: '#0b7f54' } },
        field: { value: { base: '#12a86a', _light: '#12a86a' } },
        fieldInk: { value: { base: '#04261a', _light: '#04261a' } },
        fieldInkMuted: { value: { base: '#063d28', _light: '#063d28' } },
        fieldBorder: { value: { base: '#0a6344', _light: '#0a6344' } },
      },
    },
  },
})