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
      fontOpticalSizing: 'auto',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    'h1, h2, h3, h4': {
      margin: 0,
      textWrap: 'balance',
    },
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecorationColor: 'accent',
      textDecorationThickness: '2px',
      textUnderlineOffset: '4px',
    },
    'a:hover': {
      textDecorationColor: 'accentAlt',
    },
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '3px',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },

  conditions: {
    light: '[data-theme="light"] &',
    dark: '[data-theme="dark"] &',
    hover: '&:is(:hover, [data-hover])',
  },

  theme: {
    tokens: {
      colors: {
        mulberry: {
          50: { value: '#FBEFFA' },
          100: { value: '#F6DDF3' },
          200: { value: '#EDBDE8' },
          300: { value: '#E09ADA' },
          400: { value: '#C95FC0' },
          500: { value: '#A8369E' },
          600: { value: '#86267E' },
          700: { value: '#661B60' },
          800: { value: '#4A1246' },
          900: { value: '#2E0A2C' },
        },
        mint: {
          50: { value: '#EEFDF5' },
          100: { value: '#D3F9E5' },
          200: { value: '#A9F2CC' },
          300: { value: '#74E6AD' },
          400: { value: '#42D48C' },
          500: { value: '#22B870' },
          600: { value: '#17935A' },
          700: { value: '#137349' },
          800: { value: '#115B3B' },
          900: { value: '#0C3D28' },
        },
        plum: {
          50: { value: '#F8F2F7' },
          100: { value: '#EDE2EC' },
          200: { value: '#D9C7D7' },
          300: { value: '#BFA6BC' },
          400: { value: '#A0839D' },
          500: { value: '#806380' },
          600: { value: '#644B64' },
          700: { value: '#4B374B' },
          800: { value: '#332433' },
          900: { value: '#1F151F' },
        },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '0' },
        md: { value: '0' },
        lg: { value: '0' },
        full: { value: '9999px' },
      },
    },

    semanticTokens: {
      colors: {
        bg: { value: '{colors.mulberry.800}' },
        bgAlt: { value: '{colors.mulberry.900}' },
        surface: { value: '{colors.mulberry.700}' },
        text: { value: '{colors.mint.100}' },
        textMuted: { value: '{colors.mulberry.200}' },
        textFaint: { value: '{colors.mulberry.300}' },
        accent: { value: '{colors.mint.300}' },
        accentText: { value: '{colors.mulberry.900}' },
        accentAlt: { value: '{colors.mint.400}' },
        border: { value: '{colors.mulberry.600}' },
        borderStrong: { value: '{colors.mint.300}' },
        field: { value: '{colors.mint.300}' },
        fieldInk: { value: '{colors.mulberry.900}' },
        fieldInkMuted: { value: '{colors.mulberry.700}' },
        fieldBorder: { value: '{colors.mulberry.800}' },
      },
    },
  },
})