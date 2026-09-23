import { css } from '../../../styled-system/css'
import { readQuote } from '../../lib/archive-signals'
import type { Signals } from '../api'

const block = css({
  position: 'relative',
  borderLeft: '2px solid',
  borderLeftColor: 'devPanel.muted',
  padding: '14px 18px',
  marginBottom: '12px',
  background: 'transparent',
})
const tag = css({
  position: 'absolute',
  top: '6px',
  right: '0',
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.ghost',
})
const text = css({
  fontSize: '13px',
  fontStyle: 'italic',
  color: 'devPanel.secondary',
  lineHeight: '1.6',
  marginBottom: '6px',
  paddingRight: '80px',
})
const author = css({ fontSize: '11px', fontWeight: 700, color: 'devPanel.dim' })

/** Zone 3: the day's quote, when there is one. */
export function QuoteBlock({ signals }: { signals: Signals }) {
  const quote = readQuote(signals.quote)
  if (!quote?.text) return null

  return (
    <div className={block}>
      <span className={tag}>DAILY QUOTE</span>
      <div className={text}>&ldquo;{quote.text}&rdquo;</div>
      <div className={author}>-- {quote.author}</div>
    </div>
  )
}
