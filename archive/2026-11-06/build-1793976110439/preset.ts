import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
      textRendering: 'optimizeLegibility',
    },
    body: {
      margin: '0',
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontVariantLigatures: 'common-ligatures',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease',
      _hover: {
        color: 'accentAlt',
      },
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    '@media (prefers-reduced-motion: reduce)': {
      '*': {
        animationDuration: '0.001ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.001ms !important',
      },
    },
  },

  conditions: {
    extend: {
      light: '[data-theme="light"] &',
      dark: '[data-theme="dark"] &, &',
      hover: '&:hover',
    },
  },

  theme: {
    extend: {
      tokens: {
        colors: {
          violet: {
            50: { value: '#F4F2FE' },
            100: { value: '#E8E3FC' },
            200: { value: '#CEC3F8' },
            300: { value: '#B09EF2' },
            400: { value: '#9B7DF0' },
            500: { value: '#7855E0' },
            600: { value: '#6B4BD1' },
            700: { value: '#4D309A' },
            800: { value: '#2A1C5C' },
            900: { value: '#1E1340' },
          },
          void: {
            50: { value: '#F5F4F8' },
            100: { value: '#E9E7F0' },
            200: { value: '#CFCBDD' },
            300: { value: '#ADA7C3' },
            400: { value: '#928BB0' },
            500: { value: '#615A80' },
            600: { value: '#474263' },
            700: { value: '#322E49' },
            800: { value: '#1F1C30' },
            900: { value: '#110F1D' },
            950: { value: '#0C0A16' },
          },
          signal: {
            400: { value: '#FF7A8A' },
            500: { value: '#FF4D63' },
            600: { value: '#E23150' },
          },
          glow: {
            value: '#B9A4F7',
          },
        },
        radii: {
          none: { value: '0' },
          sm: { value: '2px' },
          md: { value: '4px' },
          lg: { value: '10px' },
          full: { value: '9999px' },
        },
      },
      semanticTokens: {
        colors: {
          bg: { value: { base: '{colors.void.950}' } },
          bgAlt: { value: { base: '#141020' } },
          surface: { value: { base: '#1A1530' } },
          text: { value: { base: '{colors.void.50}' } },
          textMuted: { value: { base: '{colors.void.300}' } },
          textFaint: { value: { base: '{colors.void.400}' } },
          accent: { value: { base: '{colors.violet.400}' } },
          accentText: { value: { base: '#1A1038' } },
          accentAlt: { value: { base: '{colors.glow}' } },
          border: { value: { base: '#2A2740' } },
          borderStrong: { value: { base: '#46406A' } },
          field: { value: { base: '{colors.violet.800}' } },
          fieldInk: { value: { base: '{colors.violet.50}' } },
          fieldInkMuted: { value: { base: '{colors.violet.200}' } },
          fieldBorder: { value: { base: '{colors.violet.700}' } },
        },
      },
    },
  },
})