import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

/* Runs a row off the right edge of the viewport and hangs it left of the column. */
export const bleed = css({
  marginLeft: { base: '-16px', md: '-4vw', lg: '-32px' },
  marginRight: { base: '-16px', md: '-4vw' },
  paddingLeft: { base: '16px', md: '4vw', lg: '32px' },
  paddingRight: { base: '16px', md: '4vw' },
})

/* One column at base, title track plus meta track from md. */
export const track = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'minmax(0, 1fr)',
    md: 'minmax(0, 1fr) 200px',
    lg: 'minmax(0, 1fr) clamp(160px, calc(160px + (100vw - 1024px) * 0.34), 300px)',
  },
  columnGap: '24px',
})

export const mintRule = css({
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
})

const label = css({
  fontFamily: 'body',
  textStyle: 'xs',
  lineHeight: '1.4',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'textFaint',
  fontVariantNumeric: 'tabular-nums',
  '& span + span::before': { content: '"\u00a0\u00a0/\u00a0\u00a0"' },
})

const labelOnField = css({
  fontFamily: 'body',
  textStyle: 'xs',
  lineHeight: '1.4',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
  fontVariantNumeric: 'tabular-nums',
  '& span + span::before': { content: '"\u00a0\u00a0/\u00a0\u00a0"' },
})

const sectionHead = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: '3xl',
  lineHeight: '1',
  textTransform: 'uppercase',
  color: 'text',
  paddingBottom: '16px',
})

type LabelProps = {
  children?: ReactNode
  parts?: (string | undefined)[]
  onField?: boolean
}

export function Label({ children, parts = [], onField }: LabelProps) {
  return (
    <div className={onField ? labelOnField : label}>
      {children}
      {parts.filter(Boolean).map((part) => (
        <span key={part}>{part}</span>
      ))}
    </div>
  )
}

export function SectionHead({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={sectionHead}>
      {children}
    </h2>
  )
}
