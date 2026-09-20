/**
 * Thrown by callVisionAgent when the SDK vision call stopped at max_tokens.
 *
 * A truncated reply is not a reply. vision-router.js used to hand the SDK's
 * error message back as the critic's text, and design-agents.js parsed that
 * message as a verdict: it failed closed to REVISE and paid the engineer to
 * revise against a sentence about token counts (#570). A throw cannot be
 * mistaken for critique. The router still reports `sdk-vision-truncated`
 * through `onChannel` before throwing, so a caller that wants to record the
 * outcome has the channel name.
 *
 * Unlike ModelTransportError, the critic did see the images: the call worked
 * and ran out of room. Callers must not fall back to the text-only CLI.
 */
export class VisionTruncatedError extends Error {
  /**
   * @param {object} opts
   * @param {string} opts.agent - agent name (e.g. 'screenshot-critic')
   * @param {string} opts.reason - the SDK's own message, with token counts
   */
  constructor({ agent, reason }) {
    super(reason)
    this.name = 'VisionTruncatedError'
    this.agent = agent
    this.channel = 'sdk-vision-truncated'
    this.truncated = true
  }
}
