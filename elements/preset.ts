import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    'html': {
      WebkitTextSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontVariantNumeric: 'tabular-nums',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    'h1': {
      letterSpacing: '-0.01em',
    },
    'p': {
      margin: '0',
      textWrap: 'pretty',
    },
    'a': {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 160ms ease, border-color 160ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
    },
    'ul, ol': {
      margin: '0',
      padding: '0',
      listStyle: 'none',
    },
    'img, svg': {
      display: 'block',
      maxWidth: '100%',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    '*:focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '2px',
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
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover',
  },

  theme: {
    tokens: {
      colors: {
        azure: {
          50: { value: '#E8F3FD' },
          100: { value: '#C9E4FB' },
          200: { value: '#9CCDF6' },
          300: { value: '#63B0F0' },
          400: { value: '#38B6FF' },
          500: { value: '#1E8FE0' },
          600: { value: '#156FBF' },
          700: { value: '#11568F' },
          800: { value: '#0F3E66' },
          900: { value: '#0B2847' },
        },
        amber: {
          50: { value: '#FDF3E3' },
          100: { value: '#FADFB4' },
          200: { value: '#F5C578' },
          300: { value: '#F0AD45' },
          400: { value: '#E8962A' },
          500: { value: '#CE7D16' },
          600: { value: '#A66010' },
          700: { value: '#7E480C' },
          800: { value: '#5A330A' },
          900: { value: '#3A2107' },
        },
        neutral: {
          50: { value: '#F1F5FB' },
          100: { value: '#DFE8F3' },
          200: { value: '#BFD0E4' },
          300: { value: '#93AAC8' },
          400: { value: '#6A85A6' },
          500: { value: '#466084' },
          600: { value: '#2E466B' },
          700: { value: '#1D3250' },
          800: { value: '#13243B' },
          900: { value: '#0B1A2E' },
          950: { value: '#081322' },
        },
        white: { value: '#FFFFFF' },
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
          value: { base: '{colors.neutral.900}', _light: '{colors.neutral.50}' },
        },
        bgAlt: {
          value: { base: '{colors.neutral.800}', _light: '{colors.neutral.100}' },
        },
        surface: {
          value: { base: '{colors.neutral.700}', _light: '{colors.white}' },
        },
        text: {
          value: { base: '{colors.neutral.50}', _light: '{colors.neutral.900}' },
        },
        textMuted: {
          value: { base: '{colors.neutral.300}', _light: '{colors.neutral.600}' },
        },
        textFaint: {
          value: { base: '{colors.neutral.400}', _light: '{colors.neutral.500}' },
        },
        accent: {
          value: { base: '{colors.azure.400}', _light: '{colors.azure.600}' },
        },
        accentText: {
          value: { base: '{colors.neutral.950}', _light: '{colors.white}' },
        },
        accentAlt: {
          value: { base: '{colors.azure.200}', _light: '{colors.azure.700}' },
        },
        border: {
          value: { base: '{colors.neutral.700}', _light: '{colors.neutral.200}' },
        },
        borderStrong: {
          value: { base: '{colors.neutral.600}', _light: '{colors.neutral.300}' },
        },
        field: {
          value: { base: '{colors.azure.700}', _light: '{colors.azure.600}' },
        },
        fieldInk: {
          value: { base: '{colors.neutral.50}', _light: '{colors.white}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.azure.100}', _light: '{colors.azure.100}' },
        },
        fieldBorder: {
          value: { base: '{colors.azure.500}', _light: '{colors.azure.400}' },
        },
      },
    },
  },
})