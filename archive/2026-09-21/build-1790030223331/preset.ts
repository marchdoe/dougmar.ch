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
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:where(:hover)': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    'th, td': {
      fontVariantNumeric: 'tabular-nums',
    },
  },

  conditions: {
    _light: '&:where(.light, .light *)',
    _dark: '&:where(.dark, .dark *)',
    _hover: '&:where(:hover, :focus-visible)',
  },

  theme: {
    tokens: {
      colors: {
        rust: {
          50: { value: '#FBEDE4' },
          100: { value: '#F7D9C7' },
          200: { value: '#ECB093' },
          300: { value: '#DD8862' },
          400: { value: '#CB6A42' },
          500: { value: '#B4512C' },
          600: { value: '#97401F' },
          700: { value: '#7E3218' },
          800: { value: '#632512' },
          900: { value: '#481A0D' },
        },
        amber: {
          50: { value: '#FEF3E0' },
          100: { value: '#FCE4BE' },
          200: { value: '#F9CE86' },
          300: { value: '#F7BE6A' },
          400: { value: '#F0A03C' },
          500: { value: '#DA871F' },
          600: { value: '#C06A1E' },
          700: { value: '#9A5316' },
          800: { value: '#77400F' },
          900: { value: '#502B0A' },
        },
        sand: {
          50: { value: '#FBEEE2' },
          100: { value: '#F3DCC9' },
          200: { value: '#E4C0A6' },
          300: { value: '#CFA283' },
          400: { value: '#B08063' },
          500: { value: '#8E6047' },
          600: { value: '#6E4632' },
          700: { value: '#522F20' },
          800: { value: '#3A1F14' },
          900: { value: '#24120A' },
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
        bg: { value: { base: '{colors.rust.700}' } },
        bgAlt: { value: { base: '{colors.rust.800}' } },
        surface: { value: { base: '{colors.rust.600}' } },

        text: { value: { base: '{colors.sand.50}' } },
        textMuted: { value: { base: '{colors.rust.100}' } },
        textFaint: { value: { base: '{colors.rust.200}' } },

        accent: { value: { base: '{colors.amber.400}' } },
        accentText: { value: { base: '{colors.rust.900}' } },
        accentAlt: { value: { base: '{colors.amber.300}' } },

        border: { value: { base: '{colors.rust.500}' } },
        borderStrong: { value: { base: '{colors.rust.300}' } },

        field: { value: { base: '{colors.rust.900}' } },
        fieldInk: { value: { base: '{colors.sand.50}' } },
        fieldInkMuted: { value: { base: '{colors.rust.200}' } },
        fieldBorder: { value: { base: '{colors.rust.600}' } },
      },
    },
  },
})