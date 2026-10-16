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
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontVariantNumeric: 'oldstyle-nums',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      textWrap: 'balance',
      fontWeight: 'inherit',
    },
    p: {
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
    },
    'blockquote': {
      margin: 0,
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
        terracotta: {
          50: { value: '#FBEEE7' },
          100: { value: '#F6DBCB' },
          200: { value: '#ECB79C' },
          300: { value: '#E0926E' },
          400: { value: '#D06C43' },
          500: { value: '#B5461F' },
          600: { value: '#96391A' },
          700: { value: '#732B13' },
          800: { value: '#50200E' },
          900: { value: '#301209' },
        },
        stone: {
          50: { value: '#FAF6F1' },
          100: { value: '#F2EBE1' },
          200: { value: '#E4D8C8' },
          300: { value: '#CDBCA6' },
          400: { value: '#A28B72' },
          500: { value: '#786450' },
          600: { value: '#5E4D3C' },
          700: { value: '#44382B' },
          800: { value: '#2B2219' },
          900: { value: '#1A140D' },
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
        bg: { value: { base: '{colors.stone.50}' } },
        bgAlt: { value: { base: '{colors.terracotta.50}' } },
        surface: { value: { base: '{colors.stone.100}' } },
        text: { value: { base: '{colors.stone.900}' } },
        textMuted: { value: { base: '{colors.stone.600}' } },
        textFaint: { value: { base: '{colors.stone.500}' } },
        accent: { value: { base: '{colors.terracotta.500}' } },
        accentText: { value: { base: '{colors.stone.50}' } },
        accentAlt: { value: { base: '{colors.terracotta.400}' } },
        border: { value: { base: '{colors.stone.200}' } },
        borderStrong: { value: { base: '{colors.stone.600}' } },
        field: { value: { base: '{colors.terracotta.600}' } },
        fieldInk: { value: { base: '{colors.stone.50}' } },
        fieldInkMuted: { value: { base: '{colors.terracotta.100}' } },
        fieldBorder: { value: { base: '{colors.terracotta.400}' } },
      },
    },
  },
})