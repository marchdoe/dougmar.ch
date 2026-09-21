/**
 * The three viewports the pipeline designs for and measures at.
 *
 * The phone width lives here and nowhere else. It used to be a literal in
 * every file below, so moving it meant finding each copy by grep and hoping
 * none was missed. One of them, the guard around the surface gate's tap-target
 * and small-copy advisories, compared against the number itself and would
 * have gone quiet without failing anything.
 *
 * Who reads it:
 * - `elements/chassis/scale.js`: the narrow end of every `fluid()` clamp.
 * - `scripts/utils/chassis.js`: the catalog table and the prose facts that
 *   quote each chassis' size at the narrow end.
 * - `scripts/utils/surface-gate.js`: the mobile and tablet rungs of
 *   `VIEWPORT_RUNGS` and the advisory heading in the repair brief.
 * - `scripts/utils/snapshot.js`: `CRITIC_MOBILE_VIEWPORT`, the phone the
 *   critics are shown, and the tablet still beside it.
 * - `scripts/utils/archiver.js`: the narrow, tablet and wide entries in the
 *   responsive ladder.
 * - `scripts/utils/lessons.js`: which archived `@<width>` findings count as
 *   phone findings.
 * - The prompt strings built in JS: `scripts/agents/mockup-critic.js`,
 *   `screenshot-critic.js`, `mockup-designer.js`, `scripts/design-agents.js`
 *   and `scripts/utils/composition-grammar.js`.
 * - `scripts/utils/prompt-loader.js`: the markdown prompts in
 *   `scripts/prompts/` write the widths as `{{NARROW_PX}}` and
 *   `{{TABLET_PX}}`, filled on load.
 * - `tests/e2e/site-health.spec.ts`: the word-break gate.
 *
 * Who does not, yet: the field names `hero_step_360`, `nav_360` and
 * `HERO_STEPS_360` still spell the number out, and the prompts quote sizes
 * measured at it (a 64px hero floor, a 280px callout, the 640px fold) as
 * literals.
 *
 * It sits under `elements/chassis/` because the ramp is the first thing that
 * depends on it, and `scripts/utils/chassis.js` already imports from here.
 *
 * @module
 */

/** The phone: the width every mobile measurement and phone capture is taken at. */
export const NARROW_VIEWPORT = Object.freeze({ width: 360, height: 640 })

/** The desktop the mockup is drawn at and the critics review. */
export const WIDE_VIEWPORT = Object.freeze({ width: 1440, height: 900 })

/**
 * The tablet: a portrait iPad Air, the width between the phone and the
 * desktop that nothing measured until #565. A layout meant for 1440 that is
 * only squeezed at this width keeps its desktop grid and loses its room:
 * on 2026-09-20 the home register set 46.75px titles in 150px rows with dead
 * space under each, and every gate and image was taken at 360 or 1440.
 *
 * The surface gate walks it for horizontal overflow, clipped text and
 * console errors only; the phone-only and desktop-only checks stay where
 * they were. The critics see one still of the home page at this width.
 */
export const TABLET_VIEWPORT = Object.freeze({ width: 820, height: 1180 })
