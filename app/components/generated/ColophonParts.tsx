import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function ColophonBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h2
        className={css({
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '12px',
        })}
      >
        {label}
      </h2>
      {children}
    </div>
  )
}

export function ColophonLead({ children }: { children: ReactNode }) {
  return (
    <p
      className={css({
        fontFamily: 'display',
        fontWeight: 'bold',
        fontSize: '18px',
        fontVariantNumeric: 'tabular-nums',
        color: 'accent',
      })}
    >
      {children}
    </p>
  )
}

export function ColophonScore({ children }: { children: ReactNode }) {
  return (
    <p
      className={css({
        fontFamily: 'display',
        fontWeight: 'normal',
        fontSize: '15px',
        lineHeight: '1.7',
        fontVariantNumeric: 'tabular-nums',
        color: 'text',
      })}
    >
      {children}
    </p>
  )
}

type LineProps = { children: ReactNode; faint?: boolean; spaced?: boolean }

export function ColophonLine({ children, faint, spaced }: LineProps) {
  return (
    <p
      className={css({
        fontSize: '14px',
        lineHeight: '1.6',
        maxWidth: '46ch',
        fontVariantNumeric: 'tabular-nums',
        color: faint ? 'textFaint' : 'textMuted',
        marginTop: spaced ? '8px' : '0',
      })}
    >
      {children}
    </p>
  )
}
