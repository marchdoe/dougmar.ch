import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
      fontVariantNumeric: 'oldstyle-nums',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
      _hover: { textDecoration: 'underline' },
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
    'table': {
      fontVariantNumeric: 'tabular-nums',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
  },
  conditions: {
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover, &:focus-visible',
  },
  theme: {
    tokens: {
      colors: {
        scarlet: {
          50: { value: '#FCEDE6' },
          100: { value: '#F9D4C6' },
          200: { value: '#F2A98E' },
          300: { value: '#E87E57' },
          400: { value: '#DB4E24' },
          500: { value: '#C63C12' },
          600: { value: '#A5300C' },
          700: { value: '#882709' },
          800: { value: '#661D06' },
          900: { value: '#431304' },
        },
        neutral: {
          50: { value: '#FAF5EC' },
          100: { value: '#F2EAD9' },
          200: { value: '#E6DAC4' },
          300: { value: '#D2C2A5' },
          400: { value: '#A8956F' },
          500: { value: '#6E5F46' },
          600: { value: '#574A37' },
          700: { value: '#3A3021' },
          800: { value: '#241D12' },
          900: { value: '#15100A' },
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
          value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.900}' },
        },
        bgAlt: {
          value: { base: '{colors.neutral.200}', _dark: '{colors.neutral.800}' },
        },
        surface: {
          value: { base: '{colors.neutral.100}', _dark: '{colors.neutral.700}' },
        },
        text: {
          value: { base: '{colors.neutral.900}', _dark: '{colors.neutral.100}' },
        },
        textMuted: {
          value: { base: '{colors.neutral.600}', _dark: '{colors.neutral.300}' },
        },
        textFaint: {
          value: { base: '{colors.neutral.500}', _dark: '{colors.neutral.400}' },
        },
        accent: {
          value: { base: '{colors.scarlet.500}', _dark: '{colors.scarlet.400}' },
        },
        accentText: {
          value: { base: '#FFF8F2', _dark: '#FFF8F2' },
        },
        accentAlt: {
          value: { base: '{colors.scarlet.700}', _dark: '{colors.scarlet.300}' },
        },
        border: {
          value: { base: '{colors.neutral.300}', _dark: '{colors.neutral.700}' },
        },
        borderStrong: {
          value: { base: '{colors.neutral.400}', _dark: '{colors.neutral.600}' },
        },
        field: {
          value: { base: '{colors.scarlet.600}', _dark: '{colors.scarlet.500}' },
        },
        fieldInk: {
          value: { base: '#FFF8F2', _dark: '#FFF8F2' },
        },
        fieldInkMuted: {
          value: { base: '#F6CBB9', _dark: '#F6CBB9' },
        },
        fieldBorder: {
          value: { base: '{colors.scarlet.800}', _dark: '{colors.scarlet.700}' },
        },
      },
    },
  },
})