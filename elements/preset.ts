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
    p: {
      margin: 0,
      textWrap: 'pretty',
    },
    'p, li, blockquote': {
      color: 'text',
    },
    a: {
      color: 'accent',
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '0.15em',
    },
    '::selection': {
      background: 'accent',
      color: 'accentText',
    },
    '.tnum': {
      fontVariantNumeric: 'tabular-nums',
    },
  },
  conditions: {
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:is(:hover)',
  },
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#FDF6E3' },
          100: { value: '#FBEABD' },
          200: { value: '#F7D98A' },
          300: { value: '#F2C14E' },
          400: { value: '#EBAE1C' },
          500: { value: '#D99A06' },
          600: { value: '#B37C04' },
          700: { value: '#8A5E08' },
          800: { value: '#5E400A' },
          900: { value: '#3A2A0A' },
        },
        accent: {
          50: { value: '#FBEADF' },
          100: { value: '#F7D2BC' },
          200: { value: '#F0A868' },
          300: { value: '#E07B3A' },
          400: { value: '#C25A1C' },
          500: { value: '#9C3A0E' },
          600: { value: '#7E2E0A' },
          700: { value: '#6B2608' },
          800: { value: '#4E1B06' },
          900: { value: '#331103' },
        },
        neutral: {
          50: { value: '#FBF4E6' },
          100: { value: '#F3E8D2' },
          200: { value: '#E5D3B3' },
          300: { value: '#CDB68E' },
          400: { value: '#9C835A' },
          500: { value: '#6B5636' },
          600: { value: '#4E3C20' },
          700: { value: '#3A2C15' },
          800: { value: '#2A1E0C' },
          900: { value: '#1A1206' },
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
        bg: { value: { base: '{colors.primary.200}' } },
        bgAlt: { value: { base: '{colors.neutral.100}' } },
        surface: { value: { base: '{colors.primary.50}' } },
        text: { value: { base: '{colors.neutral.900}' } },
        textMuted: { value: { base: '{colors.neutral.600}' } },
        textFaint: { value: { base: '{colors.neutral.500}' } },
        accent: { value: { base: '{colors.accent.500}' } },
        accentText: { value: { base: '{colors.neutral.50}' } },
        accentAlt: { value: { base: '{colors.accent.300}' } },
        border: { value: { base: '{colors.neutral.300}' } },
        borderStrong: { value: { base: '{colors.neutral.600}' } },
        field: { value: { base: '{colors.neutral.800}' } },
        fieldInk: { value: { base: '{colors.neutral.50}' } },
        fieldInkMuted: { value: { base: '{colors.neutral.200}' } },
        fieldBorder: { value: { base: '{colors.neutral.400}' } },
      },
    },
  },
})