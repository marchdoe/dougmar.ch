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
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
        textDecorationColor: 'accent',
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
  },
  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
    hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: '#EBF0FF' },
          100: { value: '#D6DEFF' },
          200: { value: '#B4C2FF' },
          300: { value: '#8FA0F0' },
          400: { value: '#6E82F5' },
          500: { value: '#3B51D6' },
          600: { value: '#2B3FC4' },
          700: { value: '#22329E' },
          800: { value: '#1C2878' },
          900: { value: '#141B4E' },
        },
        amber: {
          50: { value: '#FFF6E6' },
          100: { value: '#FFE9C2' },
          200: { value: '#FFD58A' },
          300: { value: '#F7C06A' },
          400: { value: '#EFAE4C' },
          500: { value: '#ECA23D' },
          600: { value: '#C67E22' },
          700: { value: '#9E6316' },
          800: { value: '#714611' },
          900: { value: '#4A2E0B' },
        },
        neutral: {
          50: { value: '#F4F6FD' },
          100: { value: '#E7EAF6' },
          200: { value: '#CDD4EA' },
          300: { value: '#AAB4D6' },
          400: { value: '#818CB6' },
          500: { value: '#5E6893' },
          600: { value: '#474F75' },
          700: { value: '#333A58' },
          800: { value: '#22283E' },
          900: { value: '#141627' },
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
        bg: { value: { base: '{colors.blue.700}', _light: '{colors.blue.50}' } },
        bgAlt: { value: { base: '{colors.blue.800}', _light: '{colors.blue.100}' } },
        surface: { value: { base: '{colors.blue.600}', _light: '#FFFFFF' } },
        text: { value: { base: '#EAF0FF', _light: '{colors.blue.900}' } },
        textMuted: { value: { base: '#BBC7FF', _light: '#3A4580' } },
        textFaint: { value: { base: '#8FA0F0', _light: '#6670A8' } },
        accent: { value: { base: '{colors.amber.500}', _light: '{colors.amber.600}' } },
        accentText: { value: { base: '#1A1430', _light: '#1A1430' } },
        accentAlt: { value: { base: '{colors.amber.200}', _light: '{colors.amber.500}' } },
        border: { value: { base: '{colors.blue.500}', _light: '{colors.blue.200}' } },
        borderStrong: { value: { base: '{colors.blue.400}', _light: '{colors.blue.500}' } },
        field: { value: { base: '{colors.amber.500}', _light: '{colors.amber.500}' } },
        fieldInk: { value: { base: '#1A1838', _light: '#1A1838' } },
        fieldInkMuted: { value: { base: '{colors.blue.800}', _light: '{colors.blue.800}' } },
        fieldBorder: { value: { base: '{colors.amber.600}', _light: '{colors.amber.600}' } },
      },
    },
  },
})