import { definePreset } from '@pandacss/dev'

/**
 * Generated from elements/chassis/big-shoulders-atkinson.js by scripts/utils/chassis.js.
 * Listed LAST in panda.config.ts so the chassis type system — fonts,
 * fontSizes, fontWeights, lineHeights, letterSpacings, spacing, textStyles —
 * wins over any values the Art Director emits in elements/preset.ts.
 *
 * Do not edit by hand — overwritten on every daily redesign.
 */
export const chassisPreset = definePreset({
  name: 'chassis',
  // Orchestrator-owned. `extend` deep-merges into the Art Director's
  // globalCss.body instead of replacing it. See scripts/utils/chassis.js.
  globalCss: {
    extend: {
      // lineHeight rides along with the font: the spacing scale is derived
      // from the base step's size times its leading, and rhythm only means
      // something if the body actually renders at that leading.
      body: { fontFamily: 'body', lineHeight: 'normal' },
    },
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          display: { value: "\"Big Shoulders Display\", Impact, \"Arial Narrow\", sans-serif" },
          body: { value: "\"Atkinson Hyperlegible\", system-ui, -apple-system, sans-serif" },
        },
        fontSizes: {
          '2xs': { value: "0.702rem" },
          xs: { value: "0.79rem" },
          sm: { value: "0.889rem" },
          base: { value: "1rem" },
          md: { value: "1.618rem" },
          lg: { value: "2.618rem" },
          xl: { value: "clamp(2.917rem, 2.477rem + 1.954vw, 4.236rem)" },
          '2xl': { value: "clamp(3.251rem, 2.05rem + 5.338vw, 6.854rem)" },
          '3xl': { value: "clamp(3.623rem, 1.134rem + 11.061vw, 11.089rem)" },
          '4xl': { value: "clamp(4.038rem, -0.597rem + 20.599vw, 17.942rem)" },
          '5xl': { value: "clamp(4.5rem, -3.677rem + 36.341vw, 29.03rem)" },
          hero: { value: "clamp(6.854rem, 5.442rem + 6.274vw, 11.089rem)" },
        },
        fontWeights: {
          light: { value: "400" },
          normal: { value: "400" },
          medium: { value: "700" },
          semibold: { value: "700" },
          bold: { value: "900" },
        },
        lineHeights: {
          tight: { value: "0.9" },
          snug: { value: "1.1" },
          normal: { value: "1.5" },
          loose: { value: "1.7" },
        },
        letterSpacings: {
          tight: { value: "-0.01em" },
          normal: { value: "0" },
          wide: { value: "0.04em" },
          wider: { value: "0.08em" },
          widest: { value: "0.14em" },
        },
        spacing: {
          '1': { value: "4px" },
          '2': { value: "8px" },
          '3': { value: "16px" },
          '4': { value: "24px" },
          '5': { value: "32px" },
          '6': { value: "48px" },
          '7': { value: "64px" },
          '8': { value: "96px" },
          '9': { value: "128px" },
        },
      },
      textStyles: {
        '2xs': { value: { fontSize: "2xs", lineHeight: "1.4", letterSpacing: "0.04em" } },
        xs: { value: { fontSize: "xs", lineHeight: "1.4", letterSpacing: "0.03em" } },
        sm: { value: { fontSize: "sm", lineHeight: "1.45", letterSpacing: "0.01em" } },
        base: { value: { fontSize: "base", lineHeight: "1.5", letterSpacing: "0" } },
        md: { value: { fontSize: "md", lineHeight: "1.4", letterSpacing: "0" } },
        lg: { value: { fontSize: "lg", lineHeight: "1.3", letterSpacing: "-0.005em" } },
        xl: { value: { fontSize: "xl", lineHeight: "1.2", letterSpacing: "-0.01em" } },
        '2xl': { value: { fontSize: "2xl", lineHeight: "1.1", letterSpacing: "-0.01em" } },
        '3xl': { value: { fontSize: "3xl", lineHeight: "1.05", letterSpacing: "-0.005em" } },
        '4xl': { value: { fontSize: "4xl", lineHeight: "1", letterSpacing: "-0.005em" } },
        '5xl': { value: { fontSize: "5xl", lineHeight: "0.9", letterSpacing: "0" } },
        hero: { value: { fontSize: "hero", lineHeight: "0.9", letterSpacing: "0" } },
      },
    },
  },
})
