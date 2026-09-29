/**
 * Which of the vision router's channels put the pixels in front of the
 * critic. Until spec 11's 1d only `sdk-vision` did, and three modules tested
 * for that string. A keyless run now reads the screenshots from disk through
 * the CLI (`cli-vision`), and a verdict reached that way saw the build too.
 * Kept apart from vision-router.js so lessons.js can ask without importing
 * the SDK.
 *
 * @module
 */

/** @type {ReadonlySet<string>} */
const SEEING_CHANNELS = new Set(['sdk-vision', 'cli-vision'])

/**
 * @param {string|null|undefined} channel as reported through `onChannel`
 * @returns {boolean} true when the critic was given the images
 */
export function sawImages(channel) {
  return SEEING_CHANNELS.has(channel ?? '')
}
