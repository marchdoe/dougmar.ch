import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { bleed, track } from './LedgerParts'

const tail = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  paddingTop: '20px',
  paddingBottom: '8px',
  rowGap: '4px',
  alignItems: { md: 'baseline' },
})

const line = css({
  textStyle: 'sm',
  lineHeight: '1.5',
  color: 'textMuted',
  maxWidth: '60ch',
})

const side = css({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  textStyle: 'sm',
  color: 'textFaint',
  fontVariantNumeric: 'tabular-nums',
})

const contact = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  color: 'text',
  fontWeight: 'normal',
})

export function LedgerTail() {
  return (
    <footer id="contact" className={`${bleed} ${track} ${tail}`}>
      <p className={line}>
        {identity.name}. {identity.role}.
      </p>
      <div className={side}>
        <a href={`mailto:${identity.email}`} className={contact}>
          Get in touch
        </a>
        <span>2026</span>
      </div>
    </footer>
  )
}
