/**
 * Thresholds the nightly responsive scorer and the surface gate's findings
 * both judge against (#488). They used to live only in `responsive-scorer.js`,
 * read by nothing that could act on them; the surface gate needs the same
 * numbers for its `tap-target`, `small-copy` and `small-text` findings, and a
 * threshold declared twice is a threshold that can drift.
 *
 * The prompts quote the two type floors below as `{{SMALL_COPY_FLOOR_PX}}`
 * and `{{SMALL_TEXT_FLOOR_PX}}`, filled by `prompt-loader.js`. A number the
 * gate enforces and a prompt states differently is how the art director said
 * 14 and the mockup designer 16 while the gate warned at 16 (#567).
 */

/** WCAG 2.5.5 target size, and Apple's HIG minimum. */
export const TAP_TARGET_MIN_PX = 44

/**
 * Smallest body text that is comfortably readable on a phone. The responsive
 * scorer grades against it. The gate does not fail a page for it: the ramp's
 * own `sm` step is 14.22px, so a floor at 16 rejected the design system's
 * paragraphs on 8 of the last 10 nights (see `SMALL_COPY_FLOOR_PX`).
 */
export const BODY_TEXT_MIN_PX = 16

/**
 * Running copy (`p`, `li`, `blockquote`) under this is an `error` at both
 * rungs (#567). One number for both: the same `sm` paragraph is set at
 * 14.22px at 360 and at 1440, and the desktop caption or sidebar note the
 * issue expected under 16 is that same step. 14 clears `sm` and rejects `xs`
 * (12.64px) set as a sentence. Calibrated in docs/evidence/font-size-floor/.
 */
export const SMALL_COPY_FLOOR_PX = 14

/**
 * Any visible text, whatever its tag, under this is an `error` at both rungs
 * (#567). The ramp's `2xs` step is 11.23px on every chassis and 9 of the last
 * 10 nights set labels in it, so the floor sits just under it. #564 raises the
 * ramp to 12px; raise this to 12 in the same change. The type-ramp guard in
 * small-text.test.js fails if this ever passes the smallest step.
 */
export const SMALL_TEXT_FLOOR_PX = 11
