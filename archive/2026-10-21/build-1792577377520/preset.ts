import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      fontVariantNumeric: 'tabular-nums',
      WebkitFontSmoothing: 'antialiased',
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
      transition: 'color 140ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
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
        gold: {
          50: { value: '#FCF3DC' },
          100: { value: '#FBE8B8' },
          200: { value: '#F7D47E' },
          300: { value: '#F5C040' },
          400: { value: '#E8A62B' },
          500: { value: '#C8911C' },
          600: { value: '#A5760F' },
          700: { value: '#7E5A0C' },
          800: { value: '#5A410B' },
          900: { value: '#3A2A08' },
        },
        carbon: {
          50: { value: '#F7F3EA' },
          100: { value: '#ECE4D2' },
          200: { value: '#D8CBB0' },
          300: { value: '#B8A986' },
          400: { value: '#A0916D' },
          500: { value: '#6B614A' },
          600: { value: '#4A4335' },
          700: { value: '#332E25' },
          800: { value: '#211E18' },
          900: { value: '#15130F' },
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
          value: { base: '{colors.carbon.900}', _light: '{colors.carbon.50}' },
        },
        bgAlt: {
          value: { base: '{colors.carbon.800}', _light: '{colors.carbon.200}' },
        },
        surface: {
          value: { base: '{colors.carbon.700}', _light: '{colors.carbon.100}' },
        },
        text: {
          value: { base: '{colors.carbon.50}', _light: '{colors.carbon.900}' },
        },
        textMuted: {
          value: { base: '{colors.carbon.300}', _light: '{colors.carbon.600}' },
        },
        textFaint: {
          value: { base: '{colors.carbon.400}', _light: '{colors.carbon.500}' },
        },
        accent: {
          value: { base: '{colors.gold.300}', _light: '{colors.gold.600}' },
        },
        accentText: {
          value: { base: '{colors.carbon.900}', _light: '{colors.carbon.50}' },
        },
        accentAlt: {
          value: { base: '{colors.gold.400}', _light: '{colors.gold.500}' },
        },
        border: {
          value: { base: '{colors.carbon.600}', _light: '{colors.carbon.200}' },
        },
        borderStrong: {
          value: { base: '{colors.carbon.500}', _light: '{colors.carbon.300}' },
        },
        field: {
          value: { base: '{colors.gold.400}', _light: '{colors.gold.400}' },
        },
        fieldInk: {
          value: { base: '{colors.carbon.900}', _light: '{colors.carbon.900}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.carbon.700}', _light: '{colors.carbon.700}' },
        },
        fieldBorder: {
          value: { base: '{colors.carbon.600}', _light: '{colors.carbon.600}' },
        },
      },
    },
  },
})