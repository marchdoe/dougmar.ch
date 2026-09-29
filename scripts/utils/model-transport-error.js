/**
 * Thrown when a model call produced no usable response at all — a dead API
 * key, a killed process with no stdout, or an SDK call that came back with
 * no text content.
 *
 * This exists to name that failure before any parser runs. From 2026-08-04
 * to 2026-08-30, an out-of-credits key made every nightly Art Director call
 * return an empty string; that empty string reached the delimiter parser,
 * which reported "response missing or empty hero_copy (===HERO_COPY===)" —
 * a message that points at the parser, not at the API that never answered.
 * A `ModelTransportError` is thrown at the call site instead, so the failure
 * is named for what it is: no reply, not a malformed one.
 *
 * Callers may check `error.transport === true` to distinguish this from a
 * parser or validation error — for example, to skip a same-call retry that
 * would just spend a second request on the same dead channel.
 */
export class ModelTransportError extends Error {
  /**
   * @param {object} opts
   * @param {string} opts.agent - agent name (e.g. 'art-director')
   * @param {'cli'|'sdk-vision'|'cli-text-fallback'|'cli-vision'} opts.channel - which call path produced no reply
   * @param {number|null} [opts.exitCode] - process exit code; null when not a CLI call, or killed by signal
   * @param {string} [opts.stderrTail] - last 500 chars of stderr; '' when there was none
   * @param {boolean} [opts.emptyReply] - true when the call completed but returned no text
   *   (as opposed to a non-zero exit with no output at all)
   */
  constructor({ agent, channel, exitCode = null, stderrTail = '', emptyReply = false }) {
    const message = emptyReply
      ? `no response from the model for ${agent} (${channel}, empty reply)`
      : `no response from the model for ${agent} (${channel}, exit ${exitCode}): ${stderrTail}`
    super(message)
    this.name = 'ModelTransportError'
    this.agent = agent
    this.channel = channel
    this.exitCode = exitCode
    this.stderrTail = stderrTail
    this.emptyReply = emptyReply
    // Checked by callers that want to skip a retry against a channel that
    // just proved it has nothing to say — see class doc above.
    this.transport = true
  }
}
