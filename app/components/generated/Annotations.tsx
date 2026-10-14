import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Note = { label: string; body: string }

export function Annotations({
  label,
  items,
  children,
}: {
  label: string
  items: Note[]
  children?: ReactNode
}) {
  return (
    <section
      aria-label={label}
      className={css({
        bg: 'bg',
        paddingBlock: { base: '38px', lg: '48px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
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
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxWidth: '46ch',
          marginLeft: { lg: 'auto' },
          alignItems: { base: 'flex-start', lg: 'flex-end' },
          textAlign: { base: 'left', lg: 'right' },
        })}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              alignItems: { base: 'flex-start', lg: 'flex-end' },
            })}
          >
            <span
              className={css({
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                fontSize: 'xs',
                color: 'textMuted',
              })}
            >
              {item.label}
            </span>
            <span
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 'normal',
              })}
            >
              {item.body}
            </span>
          </div>
        ))}
        {children}
      </div>
    </section>
  )
}
