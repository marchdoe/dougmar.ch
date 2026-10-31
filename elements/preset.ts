import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontOpticalSizing: 'auto',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: { textDecoration: 'underline', textUnderlineOffset: '0.18em' },
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      color: 'text',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
    },
    'p, li, blockquote': {
      color: 'text',
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
        teal: {
          50: { value: '#E9F5F2' },
          100: { value: '#C9E7E1' },
          200: { value: '#9DD3CB' },
          300: { value: '#6ABCB1' },
          400: { value: '#3E9E93' },
          500: { value: '#2A8077' },
          600: { value: '#20655E' },
          700: { value: '#184F4A' },
          800: { value: '#123B38' },
          900: { value: '#0C2927' },
        },
        amber: {
          50: { value: '#FDF3E0' },
          100: { value: '#FAE2B8' },
          200: { value: '#F6CD85' },
          300: { value: '#F0B454' },
          400: { value: '#E8A23C' },
          500: { value: '#D4882A' },
          600: { value: '#B06C1C' },
          700: { value: '#8A5414' },
          800: { value: '#653D10' },
          900: { value: '#45290A' },
        },
        neutral: {
          50: { value: '#F2F6F5' },
          100: { value: '#E3EAE8' },
          200: { value: '#C7D4D1' },
          300: { value: '#A4B4B0' },
          400: { value: '#7B8D89' },
          500: { value: '#5B6D69' },
          600: { value: '#45534F' },
          700: { value: '#333E3B' },
          800: { value: '#222A28' },
          900: { value: '#141918' },
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
        bg: { value: { base: '{colors.teal.900}', _light: '{colors.teal.50}' } },
        bgAlt: { value: { base: '{colors.teal.800}', _light: '{colors.teal.100}' } },
        surface: { value: { base: '{colors.teal.700}', _light: '{colors.neutral.50}' } },
        text: { value: { base: '{colors.teal.50}', _light: '{colors.teal.900}' } },
        textMuted: { value: { base: '{colors.teal.200}', _light: '{colors.teal.600}' } },
        textFaint: { value: { base: '{colors.teal.300}', _light: '{colors.neutral.500}' } },
        accent: { value: { base: '{colors.amber.400}', _light: '{colors.amber.600}' } },
        accentText: { value: { base: '{colors.teal.900}', _light: '{colors.amber.50}' } },
        accentAlt: { value: { base: '{colors.amber.200}', _light: '{colors.amber.500}' } },
        border: { value: { base: '{colors.teal.700}', _light: '{colors.neutral.200}' } },
        borderStrong: { value: { base: '{colors.teal.400}', _light: '{colors.teal.500}' } },
        field: { value: { base: '{colors.amber.400}', _light: '{colors.amber.400}' } },
        fieldInk: { value: { base: '{colors.teal.900}', _light: '{colors.teal.900}' } },
        fieldInkMuted: { value: { base: '{colors.amber.900}', _light: '{colors.amber.900}' } },
        fieldBorder: { value: { base: '{colors.amber.700}', _light: '{colors.amber.700}' } },
      },
    },
  },
})