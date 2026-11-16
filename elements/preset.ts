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
      textDecoration: 'underline',
    },
    'strong, b': {
      fontWeight: '700',
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
        gold: {
          50: { value: '#FDF6E3' },
          100: { value: '#FBEBC0' },
          200: { value: '#F8DD93' },
          300: { value: '#F5CD5E' },
          400: { value: '#F3B733' },
          500: { value: '#E8A61C' },
          600: { value: '#C9850F' },
          700: { value: '#A1670C' },
          800: { value: '#7A4D10' },
          900: { value: '#4A2F0C' },
        },
        ember: {
          50: { value: '#FBEBC0' },
          100: { value: '#FBD3A0' },
          200: { value: '#FBA862' },
          300: { value: '#F0832A' },
          400: { value: '#D96516' },
          500: { value: '#C4560F' },
          600: { value: '#A8480C' },
          700: { value: '#8A3A09' },
          800: { value: '#6A2C07' },
          900: { value: '#471D05' },
        },
        bronze: {
          50: { value: '#FBF7EF' },
          100: { value: '#F0E8DA' },
          200: { value: '#E0D4BF' },
          300: { value: '#C9B89B' },
          400: { value: '#A89572' },
          500: { value: '#827055' },
          600: { value: '#5E4F3A' },
          700: { value: '#423728' },
          800: { value: '#2A2217' },
          900: { value: '#1A140C' },
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
          value: { base: '#1A1308', _light: '#F3B733' },
        },
        bgAlt: {
          value: { base: '#241B0C', _light: '#E69614' },
        },
        surface: {
          value: { base: '#2E2310', _light: '#F8CB5E' },
        },
        text: {
          value: { base: '#F6E6BE', _light: '#241A0A' },
        },
        textMuted: {
          value: { base: '#D4BA82', _light: '#4A3A22' },
        },
        textFaint: {
          value: { base: '#9E8349', _light: '#574630' },
        },
        accent: {
          value: { base: '#F0832A', _light: '#A8480C' },
        },
        accentText: {
          value: { base: '#1A1308', _light: '#FBEBC0' },
        },
        accentAlt: {
          value: { base: '#FBA862', _light: '#8A3A09' },
        },
        border: {
          value: { base: '#3A2C15', _light: '#C98A12' },
        },
        borderStrong: {
          value: { base: '#5C4820', _light: '#241A0A' },
        },
        field: {
          value: { base: '#E8A61C', _light: '#221808' },
        },
        fieldInk: {
          value: { base: '#231806', _light: '#F3D98A' },
        },
        fieldInkMuted: {
          value: { base: '#5E4810', _light: '#C9A24E' },
        },
        fieldBorder: {
          value: { base: '#A8780D', _light: '#4A3A1C' },
        },
      },
    },
  },
})