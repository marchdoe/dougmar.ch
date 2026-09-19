import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    body: {
      background: 'bg',
      color: 'text',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontFeatureSettings: '"kern" 1',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: 0,
      fontWeight: 'inherit',
      textWrap: 'balance',
    },
    p: { margin: 0, textWrap: 'pretty' },
    a: {
      color: 'accent',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover': {
      color: 'accentAlt',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
    '.tnum': { fontVariantNumeric: 'tabular-nums' },
    '::selection': { background: 'accentAlt', color: 'bg' },
  },
  conditions: {
    _light: '[data-theme=light] &',
    _dark: '[data-theme=dark] &',
    _hover: '&:hover',
  },
  theme: {
    tokens: {
      colors: {
        pine: {
          50: { value: '#eafaf3' },
          100: { value: '#ccf1e0' },
          200: { value: '#9ce3c4' },
          300: { value: '#63cfa2' },
          400: { value: '#2fb381' },
          500: { value: '#109a68' },
          600: { value: '#0a7d54' },
          700: { value: '#0a6244' },
          800: { value: '#0b4c37' },
          900: { value: '#093528' },
        },
        sage: {
          50: { value: '#f4f7f5' },
          100: { value: '#e7eeea' },
          200: { value: '#cdddd4' },
          300: { value: '#a7bfb2' },
          400: { value: '#7a9788' },
          500: { value: '#566d60' },
          600: { value: '#405349' },
          700: { value: '#2f3e37' },
          800: { value: '#1e2a24' },
          900: { value: '#111a15' },
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
        bg: { value: { base: '{colors.sage.50}' } },
        bgAlt: { value: { base: '{colors.sage.100}' } },
        surface: { value: { base: '#ffffff' } },
        text: { value: { base: '{colors.sage.900}' } },
        textMuted: { value: { base: '{colors.sage.600}' } },
        textFaint: { value: { base: '{colors.sage.500}' } },
        accent: { value: { base: '{colors.pine.600}' } },
        accentText: { value: { base: '#ffffff' } },
        accentAlt: { value: { base: '{colors.pine.400}' } },
        border: { value: { base: '{colors.sage.200}' } },
        borderStrong: { value: { base: '{colors.sage.400}' } },
        field: { value: { base: '{colors.pine.800}' } },
        fieldInk: { value: { base: '{colors.pine.50}' } },
        fieldInkMuted: { value: { base: '{colors.pine.200}' } },
        fieldBorder: { value: { base: '{colors.pine.600}' } },
      },
    },
  },
})