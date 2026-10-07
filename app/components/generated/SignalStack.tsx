import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SignalStack({
  head,
  label,
  children,
}: {
  head: string
  label: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={label}
      className={css({
        width: '100%',
        maxWidth: '62ch',
        marginTop: '40px',
        textAlign: 'left',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          paddingBottom: '10px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'borderStrong',
        })}
      >
        {head}
      </div>
      {children}
    </section>
  )
}

export function SignalRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '4',
        paddingBlock: '14px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
        textAlign: 'left',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          whiteSpace: 'nowrap',
        })}
      >
        {label}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          textStyle: 'sm',
          color: 'textMuted',
          textAlign: 'right',
          minWidth: '0',
          fontVariantNumeric: 'tabular-nums',
          '& b': { color: 'text', fontWeight: 'bold' },
        })}
      >
        {children}
      </span>
    </div>
  )
}
