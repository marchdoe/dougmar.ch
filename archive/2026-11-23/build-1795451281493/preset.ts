import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      textWrap: 'balance',
      fontWeight: 'inherit',
    },
    p: {
      margin: '0',
      textWrap: 'pretty',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'a:hover': {
      color: 'accent',
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
          50: { value: '#E9F5F4' },
          100: { value: '#C9E7E6' },
          200: { value: '#9BD1D0' },
          300: { value: '#63B4B5' },
          400: { value: '#369497' },
          500: { value: '#1C787C' },
          600: { value: '#146064' },
          700: { value: '#0E4D52' },
          800: { value: '#0A3C40' },
          900: { value: '#072A2D' },
        },
        saffron: {
          50: { value: '#FDF3E0' },
          100: { value: '#FBE3B8' },
          200: { value: '#F8CF85' },
          300: { value: '#F5B954' },
          400: { value: '#F2A32C' },
          500: { value: '#DD8C18' },
          600: { value: '#B9741A' },
          700: { value: '#8F5A18' },
          800: { value: '#6B4414' },
          900: { value: '#472D0E' },
        },
        neutral: {
          50: { value: '#F2F7F6' },
          100: { value: '#E2ECEB' },
          200: { value: '#C6D6D5' },
          300: { value: '#A6BCBB' },
          400: { value: '#76908F' },
          500: { value: '#556E6D' },
          600: { value: '#3E5453' },
          700: { value: '#2C3E3D' },
          800: { value: '#1C2B2A' },
          900: { value: '#0F1A19' },
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
        bg: { value: { base: '{colors.teal.700}', _light: '{colors.teal.50}' } },
        bgAlt: { value: { base: '{colors.teal.800}', _light: '{colors.teal.100}' } },
        surface: { value: { base: '{colors.teal.600}', _light: '{colors.neutral.50}' } },
        text: { value: { base: '{colors.teal.50}', _light: '{colors.teal.900}' } },
        textMuted: { value: { base: '{colors.teal.200}', _light: '{colors.teal.600}' } },
        textFaint: { value: { base: '{colors.teal.300}', _light: '{colors.teal.500}' } },
        accent: { value: { base: '{colors.saffron.400}', _light: '{colors.saffron.600}' } },
        accentText: { value: { base: '{colors.teal.900}', _light: '{colors.teal.50}' } },
        accentAlt: { value: { base: '{colors.saffron.200}', _light: '{colors.saffron.700}' } },
        border: { value: { base: '{colors.teal.600}', _light: '{colors.neutral.200}' } },
        borderStrong: { value: { base: '{colors.teal.400}', _light: '{colors.teal.500}' } },
        field: { value: { base: '{colors.saffron.400}', _light: '{colors.saffron.400}' } },
        fieldInk: { value: { base: '{colors.teal.900}', _light: '{colors.teal.900}' } },
        fieldInkMuted: { value: { base: '{colors.saffron.900}', _light: '{colors.saffron.900}' } },
        fieldBorder: { value: { base: '{colors.saffron.700}', _light: '{colors.saffron.700}' } },
      },
    },
  },
})