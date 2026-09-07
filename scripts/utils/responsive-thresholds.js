/**
 * Thresholds the nightly responsive scorer and the surface gate's advisory
 * findings both judge against (#488). They used to live only in
 * `responsive-scorer.js`, read by nothing that could act on them; the surface
 * gate needs the same two numbers for its `tap-target` and `small-copy`
 * findings, and a threshold declared twice is a threshold that can drift.
 */

/** WCAG 2.5.5 target size, and Apple's HIG minimum. */
export const TAP_TARGET_MIN_PX = 44

/** Smallest body text that is comfortably readable on a phone. */
export const BODY_TEXT_MIN_PX = 16
