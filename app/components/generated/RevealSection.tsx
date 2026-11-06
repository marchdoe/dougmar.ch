import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Props = {
  id?: string
  title?: string
  sub: string
  tone?: 'bg' | 'bgAlt'
  children: ReactNode
}

export function RevealSection({ id, title, sub, tone = 'bg', children }: Props) {
  return (
    <section
      id={id}
      className={css({
        bg: tone === 'bgAlt' ? 'bgAlt' : 'bg',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {title ? (
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '32px', lg: '44px' },
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'text',
            marginBottom: '2',
          })}
        >
          {title}
        </h2>
      ) : null}
      <span
        className={css({
          display: 'block',
          textStyle: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '6',
        })}
      >
        {sub}
      </span>
      {children}
    </section>
  )
}
