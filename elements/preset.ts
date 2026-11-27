import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
    },
    body: {
      margin: 0,
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
    'p': {
      margin: 0,
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
    'img, svg': {
      display: 'block',
      maxWidth: '100%',
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
        pine: {
          50: { value: '#EAF3EE' },
          100: { value: '#D3E6DB' },
          200: { value: '#ABCBB7' },
          300: { value: '#80A991' },
          400: { value: '#557E6B' },
          500: { value: '#3C5E4E' },
          600: { value: '#2A473A' },
          700: { value: '#1B3328' },
          800: { value: '#11211A' },
          900: { value: '#0A140F' },
        },
        green: {
          50: { value: '#E6FAF1' },
          100: { value: '#C3F2DE' },
          200: { value: '#92E6C3' },
          300: { value: '#5FD6A6' },
          400: { value: '#35C28A' },
          500: { value: '#1EA873' },
          600: { value: '#17885D' },
          700: { value: '#136B49' },
          800: { value: '#0F4F37' },
          900: { value: '#0A3324' },
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
        bg: { value: '{colors.pine.900}' },
        bgAlt: { value: '{colors.pine.800}' },
        surface: { value: '{colors.pine.700}' },
        text: { value: '{colors.pine.50}' },
        textMuted: { value: '{colors.pine.200}' },
        textFaint: { value: '{colors.pine.300}' },
        accent: { value: '{colors.green.400}' },
        accentText: { value: '{colors.pine.900}' },
        accentAlt: { value: '{colors.green.300}' },
        border: { value: '{colors.pine.600}' },
        borderStrong: { value: '{colors.pine.500}' },
        field: { value: '{colors.green.500}' },
        fieldInk: { value: '{colors.pine.900}' },
        fieldInkMuted: { value: '{colors.green.900}' },
        fieldBorder: { value: '{colors.green.700}' },
      },
    },
  },
})