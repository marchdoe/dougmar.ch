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
      padding: '0',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontOpticalSizing: 'auto',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      margin: '0',
      textWrap: 'pretty',
    },
    'blockquote, li': {
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 160ms ease',
    },
    'a:hover': {
      color: 'accent',
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
        indigo: {
          50: { value: '#EFECFB' },
          100: { value: '#E0DAF6' },
          200: { value: '#C5BAEC' },
          300: { value: '#A294DD' },
          400: { value: '#7E6DCB' },
          500: { value: '#5D4BB2' },
          600: { value: '#46388A' },
          700: { value: '#332865' },
          800: { value: '#262050' },
          850: { value: '#211B48' },
          900: { value: '#1A1639' },
        },
        amber: {
          50: { value: '#FBF3DC' },
          100: { value: '#F6E4B6' },
          200: { value: '#F2CF84' },
          300: { value: '#EEBB55' },
          400: { value: '#E8A63C' },
          500: { value: '#C4821B' },
          600: { value: '#9E6712' },
        },
        neutral: {
          50: { value: '#F5F3FB' },
          100: { value: '#EBE8F4' },
          200: { value: '#D6D1E6' },
          300: { value: '#B3ADC9' },
          400: { value: '#8A82A4' },
          500: { value: '#635C80' },
          600: { value: '#49435F' },
          700: { value: '#332F45' },
          800: { value: '#221F30' },
          900: { value: '#15131F' },
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
          value: { base: '{colors.indigo.800}', _light: '{colors.indigo.50}' },
        },
        bgAlt: {
          value: { base: '{colors.indigo.850}', _light: '{colors.neutral.100}' },
        },
        surface: {
          value: { base: '{colors.indigo.700}', _light: '{colors.neutral.50}' },
        },
        text: {
          value: { base: '{colors.indigo.50}', _light: '{colors.indigo.900}' },
        },
        textMuted: {
          value: { base: '{colors.indigo.200}', _light: '{colors.neutral.600}' },
        },
        textFaint: {
          value: { base: '{colors.indigo.300}', _light: '{colors.neutral.500}' },
        },
        accent: {
          value: { base: '{colors.amber.400}', _light: '{colors.amber.500}' },
        },
        accentText: {
          value: { base: '{colors.neutral.900}', _light: '{colors.neutral.900}' },
        },
        accentAlt: {
          value: { base: '{colors.amber.200}', _light: '{colors.amber.600}' },
        },
        border: {
          value: { base: '{colors.indigo.700}', _light: '{colors.neutral.200}' },
        },
        borderStrong: {
          value: { base: '{colors.indigo.600}', _light: '{colors.neutral.300}' },
        },
        field: {
          value: { base: '{colors.indigo.900}', _light: '{colors.indigo.700}' },
        },
        fieldInk: {
          value: { base: '{colors.indigo.50}', _light: '{colors.indigo.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.indigo.200}', _light: '{colors.indigo.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.indigo.600}', _light: '{colors.indigo.600}' },
        },
      },
    },
  },
})