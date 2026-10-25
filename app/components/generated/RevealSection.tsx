import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function RevealSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      className={css({
        paddingLeft: 'clamp(22px, 6vw, 112px)',
        paddingRight: 'clamp(22px, 6vw, 112px)',
        paddingTop: 'clamp(24px, 4vw, 40px)',
        paddingBottom: 'clamp(24px, 4vw, 40px)',
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
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
          paddingTop: '5',
        })}
      >
        <h2
          className={css({
            fontFamily: 'body',
            fontWeight: '600',
            fontSize: '13px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontVariantCaps: 'all-small-caps',
            color: 'accentAlt',
          })}
        >
          {label}
        </h2>
        <div className={css({ marginTop: '5' })}>{children}</div>
      </div>
    </section>
  )
}
