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
          /**
           * The dev-only responsive report — #554.
           *
           * `/dev/responsive` and its two components (ResponsiveCard,
           * ResponsiveTrend) each declared this same five-colour dark palette
           * inline. Neither renders in production (see the note in
           * dev-responsive-page.tsx on why they cannot even be reached from a
           * route), so nothing here competes with the nightly redesign the way
           * `archive.*` has to — it exists so three files stop repeating the
           * same five hex codes, not to survive a redesign.
           */
          dev: {
            bg: { value: '#0e1014' },
            border: { value: '#2a2f36' },
            muted: { value: '#8a8f97' },
            text: { value: '#dce0e6' },
            cyan: { value: '#00e5ff' },
            fail: { value: '#ff6b6b' },
          },
          /**
           * The dev panel's permanent mini design system — #554, alongside
           * `app/components/panel/styles.ts`'s own header comment.
           *
           * Raw values, not the day's theme: the panel is tooling, rendered
           * whether or not the nightly pipeline succeeded, and pointing it at
           * `colors.*` would make it just another exhibit the redesign can
           * break. This group exists so the 54 literals `styles.ts` used to
           * repeat inline live in one place instead.
           */
          panel: {
            ink: { value: '#18181b' },
            surface: { value: '#ffffff' },
            muted: { value: '#71717a' },
            subtle: { value: '#3f3f46' },
            border: { value: '#e4e4e7' },
            borderStrong: { value: '#d4d4d8' },
            bg: { value: '#fafafa' },
            bgMuted: { value: '#f4f4f5' },
            success: { value: '#16a34a' },
            successBg: { value: '#f0fdf4' },
            successBorder: { value: '#bbf7d0' },
            danger: { value: '#dc2626' },
            warning: { value: '#f59e0b' },
          },
          /**
           * The local /dev panel (app/dev/) — #227.
           *
           * Its own dark-blue palette, shared with neither `dev.*` (the
           * responsive report) nor `panel.*` (the phone panel). It lived as a
           * `c` object of hex strings inside the 3,600-line dev-panel.tsx and
           * reached the page through `style=` props. Translucent tints are
           * written as `devPanel.cyan/12` and the like, not as tokens of their
           * own.
           */
          devPanel: {
            bg: { value: '#050C18' },
            card: { value: '#070F1E' },
            log: { value: '#020810' },
            border: { value: '#0A1828' },
            text: { value: '#D4E8F8' },
            secondary: { value: '#7AADC4' },
            dim: { value: '#6A9DB5' },
            muted: { value: '#4E7A94' },
            ghost: { value: '#3A6080' },
            cyan: { value: '#00E5FF' },
            preview: { value: '#22d3ee' },
            green: { value: '#5CBE4A' },
            blue: { value: '#4A8FD4' },
            blueDim: { value: '#3A7FC4' },
            violet: { value: '#a78bfa' },
            orange: { value: '#f97316' },
            productHunt: { value: '#da552f' },
            yellow: { value: '#eab308' },
            red: { value: '#ef4444' },
            redSoft: { value: '#f87171' },
            redDeep: { value: '#dc2626' },
            white: { value: '#ffffff' },
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
          dev: {
            mono: { value: 'JetBrains Mono, monospace' },
          },
          devPanel: {
            mono: { value: "'Space Mono', monospace" },
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
        shadows: {
          panel: {
            sm: { value: '0 1px 3px rgba(0,0,0,.06)' },
            md: { value: '0 1px 2px rgba(0,0,0,.08)' },
            lg: { value: '0 1px 3px rgba(0,0,0,.15)' },
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
      // The /dev panel's three animations (#227), formerly a <style> element
      // the panel rendered into its own tree.
      keyframes: {
        devPanelPulseDot: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        devPanelPulse: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        devPanelSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
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
