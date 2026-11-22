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
      background: 'bg',
      color: 'text',
      margin: '0',
      fontKerning: 'normal',
      fontOpticalSizing: 'auto',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
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
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease, border-color 160ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
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
        violet: {
          50: { value: '#f4eefb' },
          100: { value: '#e7d9f6' },
          200: { value: '#d0b8ee' },
          300: { value: '#b592e3' },
          400: { value: '#9a6dd6' },
          500: { value: '#7b42d1' },
          600: { value: '#6633b0' },
          700: { value: '#51288c' },
          800: { value: '#3a1d6e' },
          900: { value: '#241243' },
        },
        neutral: {
          50: { value: '#f6f3fa' },
          100: { value: '#ece7f3' },
          200: { value: '#dcd4e8' },
          300: { value: '#c3b8d5' },
          400: { value: '#9d8fb3' },
          500: { value: '#776a8d' },
          600: { value: '#5a4e70' },
          700: { value: '#433a56' },
          800: { value: '#2d2740' },
          900: { value: '#1b1729' },
        },
        brick: {
          50: { value: '#fbeeec' },
          100: { value: '#f4d6d1' },
          200: { value: '#e8b2a9' },
          300: { value: '#d88a7c' },
          400: { value: '#c66454' },
          500: { value: '#b24a3f' },
          600: { value: '#93382f' },
          700: { value: '#722a24' },
          800: { value: '#521e19' },
          900: { value: '#33110e' },
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
        bg: { value: { base: '{colors.neutral.100}', _dark: '{colors.neutral.900}' } },
        bgAlt: { value: { base: '{colors.neutral.200}', _dark: '{colors.neutral.800}' } },
        surface: { value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.700}' } },
        text: { value: { base: '{colors.neutral.900}', _dark: '{colors.neutral.100}' } },
        textMuted: { value: { base: '{colors.neutral.700}', _dark: '{colors.neutral.300}' } },
        textFaint: { value: { base: '{colors.neutral.600}', _dark: '{colors.neutral.400}' } },
        accent: { value: { base: '{colors.violet.500}', _dark: '{colors.violet.400}' } },
        accentText: { value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.900}' } },
        accentAlt: { value: { base: '{colors.violet.700}', _dark: '{colors.violet.300}' } },
        border: { value: { base: '{colors.neutral.300}', _dark: '{colors.neutral.700}' } },
        borderStrong: { value: { base: '{colors.neutral.500}', _dark: '{colors.neutral.500}' } },
        field: { value: { base: '{colors.violet.800}', _dark: '{colors.violet.800}' } },
        fieldInk: { value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.50}' } },
        fieldInkMuted: { value: { base: '{colors.violet.200}', _dark: '{colors.violet.200}' } },
        fieldBorder: { value: { base: '{colors.violet.600}', _dark: '{colors.violet.600}' } },
      },
    },
  },
})