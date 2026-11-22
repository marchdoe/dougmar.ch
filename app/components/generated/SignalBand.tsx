import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { RevealSection } from './RevealSection'

type SignalRow = { label: string; body: ReactNode }

const srow = css({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'baseline',
  gap: '16px',
  flexWrap: 'wrap',
  borderTop: '1px solid',
  borderColor: 'border',
  paddingBlock: '14px',
  textStyle: 'sm',
  color: 'textMuted',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
})

export function SignalBand({ title, rows }: { title: string; rows: SignalRow[] }) {
  return (
    <RevealSection
      label={title}
      className={css({
        marginTop: '72px',
        paddingBlock: '40px',
        paddingInline: '20px',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        bg: 'bg',
        md: { marginTop: '96px', paddingBlock: '48px', paddingInline: '6vw' },
      })}
    >
      <h2
        className={css({
          textStyle: 'sm',
          textTransform: 'lowercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          fontWeight: 'bold',
          marginBottom: '8px',
        })}
      >
        {title}
      </h2>
      {rows.map((row) => (
        <p key={row.label} className={srow}>
          <span className={css({ color: 'text', fontWeight: 'bold' })}>{row.label}</span>
          {row.body}
        </p>
      ))}
    </RevealSection>
  )
}
