import { definePreset } from '@pandacss/dev'

export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: {
    '*': { boxSizing: 'border-box' },
    html: { WebkitTextSizeAdjust: '100%' },
    body: {
      background: 'bg',
      color: 'text',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
      fontKerning: 'normal',
    },
    'h1, h2, h3, h4, h5, h6, p, figure, blockquote': { margin: '0' },
    'h1, h2, h3, h4, h5, h6': { fontWeight: 'inherit' },
    a: {
      color: 'accentAlt',
      textDecoration: 'none',
      transition: 'color 120ms ease',
    },
    'a:hover, a:focus-visible': {
      color: 'accent',
      textDecoration: 'underline',
      textUnderlineOffset: '0.18em',
    },
    '::selection': { background: 'accent', color: 'accentText' },
    ':focus-visible': { outline: '2px solid', outlineColor: 'accent', outlineOffset: '2px' },
    '.tnum': { fontVariantNumeric: 'tabular-nums' },
  },
  conditions: {
    extend: {
      _light: '[data-theme=light] &',
      _dark: '[data-theme=dark] &',
      _hover: '&:is(:hover, :focus-visible)',
    },
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          gold: {
            50: { value: '#FBF2D6' },
            100: { value: '#F6E2A8' },
            200: { value: '#EFCB68' },
            300: { value: '#E6B436' },
            400: { value: '#D79C18' },
            500: { value: '#C8870B' },
            600: { value: '#A06E0A' },
            700: { value: '#7A5206' },
            800: { value: '#5A3D05' },
            900: { value: '#3C2904' },
          },
          parchment: {
            50: { value: '#FCF9F1' },
            100: { value: '#F5EEDD' },
            200: { value: '#EAE0C9' },
            300: { value: '#D8CBAB' },
            400: { value: '#BBAD87' },
            500: { value: '#938763' },
            600: { value: '#6E6346' },
            700: { value: '#4B4330' },
            800: { value: '#26221A' },
            900: { value: '#17150E' },
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
          bg: { value: { base: '#FCF9F1', _dark: '#17150E' } },
          bgAlt: { value: { base: '#F5EEDD', _dark: '#26221A' } },
          surface: { value: { base: '#F8F2E2', _dark: '#2E2A1D' } },
          text: { value: { base: '#17150E', _dark: '#F5EEDD' } },
          textMuted: { value: { base: '#574E38', _dark: '#C6BC9E' } },
          textFaint: { value: { base: '#6E6346', _dark: '#94886A' } },
          accent: { value: { base: '#C8870B', _dark: '#E3A827' } },
          accentText: { value: { base: '#201C10', _dark: '#201C10' } },
          accentAlt: { value: { base: '#7A5206', _dark: '#F0CF78' } },
          border: { value: { base: '#E3D8BE', _dark: '#3A3425' } },
          borderStrong: { value: { base: '#BBAD87', _dark: '#574E38' } },
          field: { value: { base: '#26221A', _dark: '#C8870B' } },
          fieldInk: { value: { base: '#FCF9F1', _dark: '#201C10' } },
          fieldInkMuted: { value: { base: '#C6BC9E', _dark: '#2E2206' } },
          fieldBorder: { value: { base: '#4B4330', _dark: '#96610A' } },
        },
      },
    },
  },
})