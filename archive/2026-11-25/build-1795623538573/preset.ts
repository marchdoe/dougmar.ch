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
      fontVariantNumeric: 'tabular-nums',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
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
    },
    'a:hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    'hr': {
      border: 'none',
      borderTop: '1px solid',
      borderColor: 'border',
      margin: '0',
    },
  },

  conditions: {
    _light: '.light &',
    _dark: '.dark &',
    _hover: '&:hover, &:focus-visible',
  },

  theme: {
    tokens: {
      colors: {
        bone: {
          50: { value: '#FBF6EF' },
          100: { value: '#F4EDE4' },
          200: { value: '#ECE2D5' },
          300: { value: '#DCD2C4' },
          400: { value: '#C3B7A6' },
          500: { value: '#9A8E80' },
          600: { value: '#6B6155' },
          700: { value: '#534A42' },
          800: { value: '#332B26' },
          900: { value: '#1E1815' },
        },
        crimson: {
          50: { value: '#FCEBEE' },
          100: { value: '#F9D4DA' },
          200: { value: '#F3A9B5' },
          300: { value: '#EC7F8E' },
          400: { value: '#E34D63' },
          500: { value: '#C8102E' },
          600: { value: '#A60E27' },
          700: { value: '#7E0A1C' },
          800: { value: '#560713' },
          900: { value: '#37050D' },
        },
        ink: {
          dark: { value: '#15100E' },
          darkAlt: { value: '#1E1714' },
          darkSurface: { value: '#261E19' },
          mutedOnDark: { value: '#BDB0A2' },
          faintOnDark: { value: '#8E8275' },
          accentOnDark: { value: '#EC6376' },
          borderOnDark: { value: '#332B26' },
          borderStrongOnDark: { value: '#5A4F47' },
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
          value: { base: '{colors.bone.100}', _dark: '{colors.ink.dark}' },
        },
        bgAlt: {
          value: { base: '{colors.bone.200}', _dark: '{colors.ink.darkAlt}' },
        },
        surface: {
          value: { base: '{colors.bone.50}', _dark: '{colors.ink.darkSurface}' },
        },
        text: {
          value: { base: '{colors.bone.900}', _dark: '{colors.bone.100}' },
        },
        textMuted: {
          value: { base: '{colors.bone.700}', _dark: '{colors.ink.mutedOnDark}' },
        },
        textFaint: {
          value: { base: '{colors.bone.600}', _dark: '{colors.ink.faintOnDark}' },
        },
        accent: {
          value: { base: '{colors.crimson.500}', _dark: '{colors.ink.accentOnDark}' },
        },
        accentText: {
          value: { base: '{colors.bone.50}', _dark: '{colors.bone.900}' },
        },
        accentAlt: {
          value: { base: '{colors.crimson.700}', _dark: '{colors.crimson.200}' },
        },
        border: {
          value: { base: '{colors.bone.300}', _dark: '{colors.ink.borderOnDark}' },
        },
        borderStrong: {
          value: { base: '{colors.bone.800}', _dark: '{colors.ink.borderStrongOnDark}' },
        },
        field: {
          value: { base: '{colors.crimson.500}', _dark: '{colors.crimson.500}' },
        },
        fieldInk: {
          value: { base: '{colors.bone.50}', _dark: '{colors.bone.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.crimson.100}', _dark: '{colors.crimson.100}' },
        },
        fieldBorder: {
          value: { base: '{colors.crimson.200}', _dark: '{colors.crimson.200}' },
        },
      },
    },
  },
})