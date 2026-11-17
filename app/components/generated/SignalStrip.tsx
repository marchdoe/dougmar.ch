import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const line = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariantNumeric: 'tabular-nums',
  textStyle: 'sm',
  lineHeight: '1.9',
  letterSpacing: '0.01em',
  color: 'textMuted',
})

const label = css({
  display: 'inline-block',
  minWidth: '5.5em',
  fontWeight: 'bold',
  color: 'textMuted',
})

export function StripLine({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p className={line}>
      <span className={label}>{name}</span>
      {children}
    </p>
  )
}

export function StripFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      className={css({
        marginTop: 'clamp(24px, 4vw, 48px)',
        paddingTop: 'clamp(18px, 3vw, 28px)',
        paddingBottom: 'clamp(28px, 5vw, 56px)',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: '2xs',
          color: 'textMuted',
          marginBottom: '14px',
        })}
      >
        {title}
      </div>
      {children}
    </section>
  )
}

export function SignalStrip() {
  return (
    <StripFrame title="Today">
      <StripLine name="Golf">
        Austin Championship · Final · Chad Ramey{' '}
        <span
          className={css({
            color: 'text',
            fontWeight: 'bold',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          })}
        >
          −20
        </span>
      </StripLine>
      <StripLine name="Market">SPY 739.95 ▼1.91%</StripLine>
      <StripLine name="Lions">Lions 35–10</StripLine>
      <StripLine name="Aldie VA">45°F sunny · first-quarter moon</StripLine>
      <p
        className={css({
          marginTop: '14px',
          fontFamily: 'display',
          textStyle: 'sm',
          lineHeight: '1.6',
          color: 'textMuted',
        })}
      >
        <span className={css({ color: 'text', fontWeight: 'bold' })}>On rotation:</span> The War on
        Drugs, My Morning Jacket, Tobin Sprout
      </p>
    </StripFrame>
  )
}
