import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: 0,
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    '*': {
      boxSizing: 'border-box',
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
      color: 'textMuted',
      textDecoration: 'none',
      _hover: {
        color: 'accent',
      },
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
        claret: {
          50: { value: '#FCEAF1' },
          100: { value: '#F7CDDC' },
          200: { value: '#ECA0B8' },
          300: { value: '#DC7092' },
          400: { value: '#C44A6E' },
          500: { value: '#A42F53' },
          600: { value: '#822340' },
          700: { value: '#611830' },
          800: { value: '#451221' },
          900: { value: '#2C0B15' },
        },
        amber: {
          50: { value: '#FCF1DC' },
          100: { value: '#F8E0B4' },
          200: { value: '#F2C878' },
          300: { value: '#EBB14A' },
          400: { value: '#E3A94A' },
          500: { value: '#BD7A24' },
          600: { value: '#9E6A20' },
          700: { value: '#764E1A' },
          800: { value: '#513614' },
          900: { value: '#33220D' },
        },
        bone: {
          50: { value: '#FBF6EE' },
          100: { value: '#F3EADF' },
          200: { value: '#E8D8C8' },
          300: { value: '#D6C0AC' },
          400: { value: '#B9997E' },
          500: { value: '#94715C' },
          600: { value: '#6E4C40' },
          700: { value: '#4F322C' },
          800: { value: '#341C1E' },
          900: { value: '#221016' },
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
          value: { base: '{colors.claret.900}', _light: '{colors.bone.100}' },
        },
        bgAlt: {
          value: { base: '{colors.bone.900}', _light: '{colors.bone.200}' },
        },
        surface: {
          value: { base: '{colors.claret.800}', _light: '{colors.bone.50}' },
        },
        text: {
          value: { base: '{colors.bone.100}', _light: '{colors.claret.900}' },
        },
        textMuted: {
          value: { base: '{colors.claret.200}', _light: '{colors.claret.700}' },
        },
        textFaint: {
          value: { base: '{colors.bone.400}', _light: '{colors.bone.700}' },
        },
        accent: {
          value: { base: '{colors.amber.300}', _light: '{colors.amber.500}' },
        },
        accentText: {
          value: { base: '{colors.claret.900}', _light: '{colors.claret.900}' },
        },
        accentAlt: {
          value: { base: '{colors.amber.200}', _light: '{colors.amber.400}' },
        },
        border: {
          value: { base: '{colors.claret.700}', _light: '{colors.bone.300}' },
        },
        borderStrong: {
          value: { base: '{colors.amber.400}', _light: '{colors.claret.600}' },
        },
        field: {
          value: { base: '{colors.claret.800}', _light: '{colors.claret.800}' },
        },
        fieldInk: {
          value: { base: '{colors.bone.100}', _light: '{colors.bone.100}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.claret.200}', _light: '{colors.claret.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.claret.600}', _light: '{colors.claret.700}' },
        },
      },
    },
  },
})