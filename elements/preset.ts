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
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'h1': {
      fontOpticalSizing: 'auto',
    },
    'p': {
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease',
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
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        amber: {
          50: { value: '#FDF6E6' },
          100: { value: '#FAEAC2' },
          200: { value: '#F3D484' },
          300: { value: '#EFC056' },
          400: { value: '#E6A82A' },
          500: { value: '#CC8E14' },
          600: { value: '#A06B0C' },
          700: { value: '#7A5009' },
          800: { value: '#543807' },
          900: { value: '#382505' },
        },
        brown: {
          50: { value: '#F7F1E6' },
          100: { value: '#EADCC4' },
          200: { value: '#D4BE96' },
          300: { value: '#B99C68' },
          400: { value: '#9A7D44' },
          500: { value: '#78602E' },
          600: { value: '#5E4A20' },
          700: { value: '#45300F' },
          800: { value: '#35250B' },
          900: { value: '#241904' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '2px' },
        md: { value: '4px' },
        lg: { value: '6px' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: '{colors.brown.700}' },
        bgAlt: { value: '{colors.brown.800}' },
        surface: { value: '{colors.brown.600}' },
        text: { value: '{colors.brown.50}' },
        textMuted: { value: '{colors.brown.200}' },
        textFaint: { value: '{colors.brown.300}' },
        accent: { value: '{colors.amber.400}' },
        accentText: { value: '{colors.brown.900}' },
        accentAlt: { value: '{colors.amber.300}' },
        border: { value: '{colors.brown.500}' },
        borderStrong: { value: '{colors.brown.400}' },
        field: { value: '{colors.amber.400}' },
        fieldInk: { value: '{colors.brown.900}' },
        fieldInkMuted: { value: '{colors.brown.700}' },
        fieldBorder: { value: '{colors.amber.600}' },
      },
    },
  },
})