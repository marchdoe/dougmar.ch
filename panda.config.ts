import { defineConfig } from '@pandacss/dev'
import { elementsPreset } from './elements/preset'
import { chassisPreset } from './elements/chassis-preset'

export default defineConfig({
  preflight: false,
  // chassisPreset listed LAST so its fonts + fontSizes win even if the
  // Token Designer accidentally emits its own. See elements/chassis-preset.ts.
  presets: [elementsPreset, chassisPreset],
  include: ['./app/**/*.{ts,tsx}'],
  exclude: [],
  // /elements prints whatever tokens tonight's preset defines and paints each
  // one by name, so the class for `background: 'teal.400'` cannot be found by
  // reading the source. These five properties get a class per token, whatever
  // the preset holds; nothing else here is generated ahead of use. See #552.
  staticCss: {
    css: [
      {
        properties: {
          background: ['*'],
          fontSize: ['*'],
          fontWeight: ['*'],
          letterSpacing: ['*'],
          paddingInlineStart: ['*'],
        },
      },
    ],
  },
  outdir: 'styled-system',
  jsxFramework: 'react',
  theme: {
    extend: {
      /**
       * The archive's fixed identity — #152, #157.
       *
       * The archive is the one part of this site that must not change nightly.
       * It is the container the changing things sit in, and a container that
       * redesigns itself every night is just another exhibit.
       *
       * These live in panda.config.ts because it is orchestrator-owned. Neither
       * `elements/preset.ts` nor `elements/chassis-preset.ts` can be used here:
       * both carry "overwritten on every daily redesign" at the top, and the
       * chassis type ramp really does move — `2xl` was 5.063rem on 2026-07-22
       * and 3.157rem on 2026-07-24. Borrowing it would resize the archive's
       * headline every morning.
       *
       * The palette is achromatic on purpose. The only color on an archive
       * surface comes from the days themselves — the hue of each build, filling
       * its cell in the calendar. Chrome that competed with that would be
       * chrome arguing with the collection.
       *
       * `archive.bg` is the same #0e0e10 as the frame rail injected into every
       * snapshot by scripts/utils/archive-seal.js, so the surfaces and the
       * frame read as one system rather than two.
       */
      tokens: {
        colors: {
          archive: {
            bg: { value: '#0e0e10' },
            panel: { value: '#161619' },
            line: { value: '#26262b' },
            lineSoft: { value: '#1d1d21' },
            text: { value: '#e8e8ea' },
            dim: { value: '#8a8a93' },
            // 4.56:1 on archive.bg. The old #4a4a52 was 2.2:1, under the 4.5:1
            // floor for small text. Faint text sits on archive.bg only.
            faint: { value: '#7a7a87' },
          },
        },
        fonts: {
          archive: {
            // Mono leads. The nightly designs are expressive — Anton, Fraunces,
            // Big Shoulders — so the archive reads as a record instead: a
            // catalog, not a poster.
            mono: {
              value:
                "'IBM Plex Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
            },
            sans: {
              value: "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
            },
          },
        },
        fontSizes: {
          archive: {
            // The floor: labels, keys and swatch captions. Nothing on /archive
            // or /how goes below 12px. The 11px `micro` this replaced was
            // under the pipeline's own floor.
            label: { value: '0.75rem' },
            small: { value: '0.8125rem' },
            body: { value: '1rem' },
            lead: { value: '1.0625rem' },
            title: { value: '1.5rem' },
            display: { value: '2.25rem' },
          },
        },
        /**
         * The four keyword sizes, restored.
         *
         * Naming any preset in `presets` replaces `@pandacss/preset-panda`
         * (the base preset still loads; only the theme is dropped), so this
         * theme has no `sizes` scale beyond the breakpoint-* keys Panda
         * derives on its own. `width: 'full'` — the most ordinary thing anyone
         * who knows Panda or Tailwind will write — therefore resolved to
         * nothing and shipped the literal `width:full`, which the browser
         * drops. That failed the 2026-09-01 dry run.
         *
         * Values copied from @pandacss/preset-panda so the idiom means what it
         * means everywhere else. Deliberately no numeric keys: upstream has
         * none either, and `width: '11'` must keep failing — an 11px brand
         * mark against a 44px mockup is the defect the token gate was built
         * for.
         *
         * Here rather than in a preset because agents cannot write
         * panda.config.ts, so a bad night cannot remove them.
         */
        sizes: {
          full: { value: '100%' },
          min: { value: 'min-content' },
          max: { value: 'max-content' },
          fit: { value: 'fit-content' },
        },
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  conditions: {
    extend: {
      light: '.light &, [data-theme=light] &',
      dark: '.dark &,  [data-theme=dark] &',
      mobile: '@media (max-width: 767px)',
    },
  },
})
