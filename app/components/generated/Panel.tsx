import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const revealStyles = {
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
} as const

export function DesignedPanel({ note, children }: { note: string; children: ReactNode }) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        borderRadius: 'md',
        p: { base: '5', lg: '8' },
        ...revealStyles,
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          gap: '3',
          mb: '5',
          flexWrap: 'wrap',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '2xl',
            textTransform: 'uppercase',
            color: 'accent',
            letterSpacing: 'tight',
          })}
        >
          Designed
        </span>
        <span
          className={css({
            textStyle: 'sm',
            color: 'textFaint',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          {note}
        </span>
      </div>
      {children}
    </section>
  )
}

export function BuiltPanel({ note, children }: { note: string; children: ReactNode }) {
  return (
    <aside
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderRadius: 'md',
        p: { base: '5', lg: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '7',
        ...revealStyles,
      })}
    >
      <div className={css({ display: 'flex', alignItems: 'baseline', gap: '3', flexWrap: 'wrap' })}>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '2xl',
            textTransform: 'uppercase',
            color: 'fieldInk',
            letterSpacing: 'tight',
          })}
        >
          Built
        </span>
        <span
          className={css({
            textStyle: 'sm',
            color: 'fieldInkMuted',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          {note}
        </span>
      </div>
      {children}
    </aside>
  )
}
