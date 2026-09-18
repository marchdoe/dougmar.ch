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
      padding: '0',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontVariantNumeric: 'tabular-nums',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p': {
      margin: '0',
      textWrap: 'pretty',
    },
    'a': {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    'img, svg': {
      display: 'block',
      maxWidth: '100%',
    },
    '.tnum': {
      fontVariantNumeric: 'tabular-nums',
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
        violet: {
          50: { value: '#F1ECFB' },
          100: { value: '#E2D6F7' },
          200: { value: '#C6ADEE' },
          300: { value: '#A784E2' },
          400: { value: '#8A5FD4' },
          500: { value: '#6E42BE' },
          600: { value: '#573396' },
          700: { value: '#432774' },
          800: { value: '#2E1A54' },
          900: { value: '#1D1038' },
        },
        green: {
          50: { value: '#E9F8EF' },
          100: { value: '#C8F0D8' },
          200: { value: '#93E0B4' },
          300: { value: '#5CCB8C' },
          400: { value: '#2FA966' },
          500: { value: '#147A44' },
          600: { value: '#0F5C33' },
          700: { value: '#0B4527' },
          800: { value: '#07301B' },
          900: { value: '#041F11' },
        },
        bone: {
          50: { value: '#FBF7EF' },
          100: { value: '#F6F1E7' },
          200: { value: '#EFE8DA' },
          300: { value: '#DFD5C2' },
          400: { value: '#C7BAA1' },
          500: { value: '#9F947F' },
          600: { value: '#78705F' },
          700: { value: '#585141' },
          800: { value: '#2A251D' },
          900: { value: '#171410' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '4px' },
        md: { value: '8px' },
        lg: { value: '16px' },
        full: { value: '9999px' },
      },
    },

    semanticTokens: {
      colors: {
        bg: { value: '#F4EEE3' },
        bgAlt: { value: '{colors.bone.200}' },
        surface: { value: '{colors.bone.50}' },
        text: { value: '#241938' },
        textMuted: { value: '#5B5170' },
        textFaint: { value: '#6E6580' },
        accent: { value: '{colors.green.500}' },
        accentText: { value: '#FBF7EF' },
        accentAlt: { value: '{colors.green.600}' },
        border: { value: '{colors.bone.300}' },
        borderStrong: { value: '{colors.bone.500}' },
        field: { value: '{colors.violet.800}' },
        fieldInk: { value: '#F4EEE3' },
        fieldInkMuted: { value: '#B9AED0' },
        fieldBorder: { value: '{colors.violet.600}' },
      },
    },
  },
})