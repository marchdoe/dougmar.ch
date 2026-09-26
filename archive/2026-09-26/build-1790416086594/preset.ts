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
    a: {
      color: 'text',
      textDecoration: 'none',
      transition: 'color 140ms ease',
    },
    'a:hover': {
      color: 'accent',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'p, li, blockquote': {
      textWrap: 'pretty',
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
        gold: {
          50: { value: '#FBF3DE' },
          100: { value: '#F7E7BC' },
          200: { value: '#F0D287' },
          300: { value: '#E9BE55' },
          400: { value: '#D8A733' },
          500: { value: '#C89526' },
          600: { value: '#A2761D' },
          700: { value: '#7A5817' },
          800: { value: '#533C12' },
          900: { value: '#2E220B' },
        },
        ink: {
          50: { value: '#F6F2E9' },
          100: { value: '#E7E1D0' },
          200: { value: '#CDC5AF' },
          300: { value: '#A79E84' },
          400: { value: '#7E765E' },
          500: { value: '#5A5341' },
          600: { value: '#403A2C' },
          700: { value: '#2C271D' },
          800: { value: '#1C1812' },
          900: { value: '#100D08' },
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
        bg: { value: { base: '{colors.ink.900}' } },
        bgAlt: { value: { base: '{colors.ink.800}' } },
        surface: { value: { base: '{colors.ink.700}' } },
        text: { value: { base: '{colors.ink.50}' } },
        textMuted: { value: { base: '{colors.ink.200}' } },
        textFaint: { value: { base: '{colors.ink.300}' } },
        accent: { value: { base: '{colors.gold.300}' } },
        accentText: { value: { base: '{colors.ink.900}' } },
        accentAlt: { value: { base: '{colors.gold.200}' } },
        border: { value: { base: '{colors.ink.700}' } },
        borderStrong: { value: { base: '{colors.ink.500}' } },
        field: { value: { base: '{colors.gold.900}' } },
        fieldInk: { value: { base: '{colors.gold.100}' } },
        fieldInkMuted: { value: { base: '{colors.ink.200}' } },
        fieldBorder: { value: { base: '{colors.gold.700}' } },
      },
    },
  },
})