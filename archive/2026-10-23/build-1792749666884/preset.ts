import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': { margin: '0', padding: '0', boxSizing: 'border-box' },
    html: { WebkitTextSizeAdjust: '100%', textSizeAdjust: '100%' },
    body: {
      background: 'bg',
      color: 'text',
      fontKerning: 'normal',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '0',
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: { textWrap: 'pretty' },
    a: { color: 'inherit', textDecoration: 'none' },
    'a:hover': { color: 'accent' },
    '::selection': { background: 'accent', color: 'accentText' },
  },
  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
    hover: '&:hover',
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          cream: {
            50: { value: '#FAF7F0' },
            100: { value: '#F3EEE3' },
            200: { value: '#E7DFCE' },
            300: { value: '#D4C9B1' },
            400: { value: '#AFA384' },
            500: { value: '#857A5E' },
            600: { value: '#6E6348' },
            700: { value: '#4A4332' },
            800: { value: '#2B2820' },
            900: { value: '#1A1813' },
          },
          fairway: {
            50: { value: '#E8F2EB' },
            100: { value: '#CFE6D6' },
            200: { value: '#A6D0B4' },
            300: { value: '#6FB388' },
            400: { value: '#3E9263' },
            500: { value: '#2A7048' },
            600: { value: '#1F5637' },
            700: { value: '#174129' },
            800: { value: '#102E1D' },
            900: { value: '#0A1E13' },
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
          bg: { value: { base: '{colors.cream.50}', _dark: '{colors.cream.900}' } },
          bgAlt: { value: { base: '#EDE4D2', _dark: '#221F18' } },
          surface: { value: { base: '{colors.cream.100}', _dark: '#262219' } },

          text: { value: { base: '{colors.cream.800}', _dark: '{colors.cream.100}' } },
          textMuted: { value: { base: '#5E543D', _dark: '#C3B99E' } },
          textFaint: { value: { base: '#7C7154', _dark: '#8E835F' } },

          accent: { value: { base: '{colors.fairway.500}', _dark: '{colors.fairway.300}' } },
          accentText: { value: { base: '{colors.cream.50}', _dark: '{colors.fairway.900}' } },
          accentAlt: { value: { base: '{colors.fairway.600}', _dark: '{colors.fairway.400}' } },

          border: { value: { base: '#DCD3BE', _dark: '#332F24' } },
          borderStrong: { value: { base: '{colors.cream.700}', _dark: '#5A5240' } },

          field: { value: { base: '{colors.fairway.500}', _dark: '{colors.fairway.600}' } },
          fieldInk: { value: { base: '{colors.cream.50}', _dark: '{colors.cream.50}' } },
          fieldInkMuted: { value: { base: '#BFD9C8', _dark: '#BFD9C8' } },
          fieldBorder: { value: { base: '#4E8F6A', _dark: '#4E8F6A' } },
        },
      },
    },
  },
})