import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    ':root': {
      colorScheme: 'dark',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
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
      textDecoration: 'underline',
      textUnderlineOffset: '0.16em',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    'article p': {
      maxWidth: '66ch',
    },
  },
  conditions: {
    extend: {
      _light: '[data-theme=light] &',
      _dark: '[data-theme=dark] &',
      _hover: '&:hover',
    },
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          ochre: {
            50: { value: '#FBF3DF' },
            100: { value: '#F6E7BD' },
            200: { value: '#EACF86' },
            300: { value: '#DAB552' },
            400: { value: '#C39A2E' },
            500: { value: '#A9821F' },
            600: { value: '#8C6510' },
            700: { value: '#6E4E0C' },
            800: { value: '#503809' },
            900: { value: '#322305' },
          },
          marigold: {
            50: { value: '#FEF4D8' },
            100: { value: '#FCE6A6' },
            200: { value: '#F9D46B' },
            300: { value: '#F5BE33' },
            400: { value: '#F0AC1C' },
            500: { value: '#D2920F' },
            600: { value: '#A9740B' },
            700: { value: '#7F5708' },
            800: { value: '#563B06' },
            900: { value: '#2E2003' },
          },
          sand: {
            50: { value: '#FBF6EA' },
            100: { value: '#F3E9D0' },
            200: { value: '#E4D4A9' },
            300: { value: '#CDB77D' },
            400: { value: '#B09656' },
            500: { value: '#8E7538' },
            600: { value: '#6E5A28' },
            700: { value: '#52431D' },
            800: { value: '#372D13' },
            900: { value: '#1E180A' },
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
          bg: { value: { base: '{colors.ochre.600}' } },
          bgAlt: { value: { base: '{colors.ochre.800}' } },
          surface: { value: { base: '{colors.ochre.700}' } },
          text: { value: { base: '{colors.sand.50}' } },
          textMuted: { value: { base: '{colors.sand.200}' } },
          textFaint: { value: { base: '#BFA463' } },
          accent: { value: { base: '{colors.marigold.400}' } },
          accentText: { value: { base: '{colors.ochre.900}' } },
          accentAlt: { value: { base: '{colors.marigold.300}' } },
          border: { value: { base: '{colors.ochre.500}' } },
          borderStrong: { value: { base: '{colors.ochre.400}' } },
          field: { value: { base: '{colors.marigold.400}' } },
          fieldInk: { value: { base: '{colors.ochre.900}' } },
          fieldInkMuted: { value: { base: '{colors.ochre.700}' } },
          fieldBorder: { value: { base: '{colors.marigold.600}' } },
        },
      },
    },
  },
})