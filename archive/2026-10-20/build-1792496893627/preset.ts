import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',

  globalCss: {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    html: {
      WebkitTextSizeAdjust: '100%',
      textSizeAdjust: '100%',
    },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontVariantNumeric: 'tabular-nums',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: {
      textWrap: 'pretty',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '0.18em',
      textDecorationColor: 'accent',
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
        ramps: {
          primary: {
            50: { value: '#edf4fc' },
            100: { value: '#d3e5f8' },
            200: { value: '#a7ccf1' },
            300: { value: '#84b7eb' },
            400: { value: '#3a83d6' },
            500: { value: '#1a66c0' },
            600: { value: '#125aa8' },
            700: { value: '#0e4789' },
            800: { value: '#0a335f' },
            900: { value: '#07213f' },
          },
          amber: {
            50: { value: '#fef5e6' },
            100: { value: '#fde7bf' },
            200: { value: '#fbd088' },
            300: { value: '#f8b44d' },
            400: { value: '#f5a623' },
            500: { value: '#e08c0c' },
            600: { value: '#b86f0a' },
            700: { value: '#8f5508' },
            800: { value: '#613a06' },
            900: { value: '#3a2304' },
          },
          neutral: {
            50: { value: '#f8fbff' },
            100: { value: '#eef3f9' },
            200: { value: '#cdd9e6' },
            300: { value: '#a6b6c9' },
            400: { value: '#7789a3' },
            500: { value: '#576a85' },
            600: { value: '#42526a' },
            700: { value: '#2f3c4e' },
            800: { value: '#1e2734' },
            900: { value: '#111823' },
          },
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
          value: { base: '{colors.ramps.primary.700}', _light: '{colors.ramps.primary.50}' },
        },
        bgAlt: {
          value: { base: '{colors.ramps.primary.800}', _light: '{colors.ramps.primary.100}' },
        },
        surface: {
          value: { base: '{colors.ramps.primary.600}', _light: '{colors.ramps.neutral.50}' },
        },
        text: {
          value: { base: '{colors.ramps.primary.50}', _light: '{colors.ramps.primary.900}' },
        },
        textMuted: {
          value: { base: '{colors.ramps.primary.200}', _light: '{colors.ramps.primary.600}' },
        },
        textFaint: {
          value: { base: '{colors.ramps.primary.300}', _light: '{colors.ramps.primary.500}' },
        },
        accent: {
          value: { base: '{colors.ramps.amber.400}', _light: '{colors.ramps.amber.600}' },
        },
        accentText: {
          value: { base: '{colors.ramps.amber.900}', _light: '{colors.ramps.amber.50}' },
        },
        accentAlt: {
          value: { base: '{colors.ramps.amber.300}', _light: '{colors.ramps.amber.500}' },
        },
        border: {
          value: { base: '{colors.ramps.primary.500}', _light: '{colors.ramps.primary.200}' },
        },
        borderStrong: {
          value: { base: '{colors.ramps.primary.400}', _light: '{colors.ramps.primary.400}' },
        },
        field: {
          value: { base: '{colors.ramps.primary.900}', _light: '{colors.ramps.primary.800}' },
        },
        fieldInk: {
          value: { base: '{colors.ramps.primary.50}', _light: '{colors.ramps.primary.50}' },
        },
        fieldInkMuted: {
          value: { base: '{colors.ramps.primary.200}', _light: '{colors.ramps.primary.200}' },
        },
        fieldBorder: {
          value: { base: '{colors.ramps.primary.600}', _light: '{colors.ramps.primary.600}' },
        },
      },
    },
  },
})