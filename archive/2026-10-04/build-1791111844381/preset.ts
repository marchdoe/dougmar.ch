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
      fontKerning: 'normal',
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
    'a:hover': { color: 'accentAlt', textDecoration: 'underline' },
    '::selection': { background: 'accent', color: 'accentText' },
  },

  conditions: {
    _light: '[data-theme="light"] &',
    _dark: '[data-theme="dark"] &',
    _hover: '&:hover',
  },

  theme: {
    tokens: {
      colors: {
        magenta: {
          50: { value: '#FBF7FA' },
          100: { value: '#FBDDF0' },
          200: { value: '#F7B9E1' },
          300: { value: '#F088CE' },
          400: { value: '#E84FB8' },
          500: { value: '#DE1FAD' },
          600: { value: '#C01593' },
          700: { value: '#981073' },
          800: { value: '#6E0C54' },
          900: { value: '#450836' },
        },
        plum: {
          50: { value: '#FBF7FA' },
          100: { value: '#F3EDF1' },
          200: { value: '#E3D9E0' },
          300: { value: '#C9BBC6' },
          400: { value: '#9E8B99' },
          500: { value: '#766575' },
          600: { value: '#574A57' },
          700: { value: '#3C3340' },
          800: { value: '#251F2A' },
          900: { value: '#15101A' },
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
        bg: { value: '{colors.magenta.400}' },
        bgAlt: { value: '{colors.magenta.500}' },
        surface: { value: '{colors.magenta.300}' },
        text: { value: '{colors.plum.900}' },
        textMuted: { value: '{colors.plum.800}' },
        textFaint: { value: '{colors.plum.700}' },
        accent: { value: '{colors.magenta.700}' },
        accentText: { value: '{colors.magenta.50}' },
        accentAlt: { value: '{colors.magenta.800}' },
        border: { value: '{colors.magenta.600}' },
        borderStrong: { value: '{colors.magenta.700}' },
        field: { value: '{colors.magenta.800}' },
        fieldInk: { value: '{colors.magenta.50}' },
        fieldInkMuted: { value: '{colors.magenta.200}' },
        fieldBorder: { value: '{colors.magenta.700}' },
      },
    },
  },
})