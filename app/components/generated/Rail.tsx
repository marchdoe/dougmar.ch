import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function Rail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside
      aria-label={label}
      className={css({
        bg: 'surface',
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '4', lg: '5' },
        paddingTop: '5',
        paddingBottom: { base: '6', lg: '7' },
        paddingInline: { base: '4', lg: '5' },
        borderTopWidth: { base: '1px', lg: '0' },
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        borderRightWidth: { base: '0', lg: '1px' },
        borderRightStyle: 'solid',
        borderRightColor: 'fieldBorder',
        gridColumn: { lg: '1' },
        gridRow: { lg: '1' },
        minWidth: '0',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {label}
      </div>
      {children}
    </aside>
  )
}

export function Sig({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        paddingBottom: '4',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
        minWidth: '0',
        _last: { borderBottomWidth: '0', paddingBottom: '0' },
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '2',
        })}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

export function Score({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        fontFamily: 'display',
        textStyle: '2xl',
        fontWeight: 'bold',
        lineHeight: 'tight',
        color: 'accentAlt',
      })}
    >
      {children}
    </div>
  )
}

export function SigNote({ children }: { children: ReactNode }) {
  return (
    <p
      className={css({
        fontSize: 'sm',
        lineHeight: 'normal',
        color: 'textMuted',
        marginTop: '2',
        maxWidth: '45ch',
      })}
    >
      {children}
    </p>
  )
}
