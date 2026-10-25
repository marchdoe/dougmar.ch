import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { Ground } from '../Material'
import { Halo } from './Halo'
import { SentenceNav } from './SentenceNav'

type Props = { eyebrow: string; title: string; titleClassName: string; meta?: ReactNode }

export function InteriorHead({ eyebrow, title, titleClassName, meta }: Props) {
  return (
    <section className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="dots" seed={625314833} />
      <Halo />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1.55fr) minmax(220px, 0.45fr)' },
        })}
      >
        <div
          className={css({
            paddingTop: 'clamp(32px, 6vw, 88px)',
            paddingBottom: 'clamp(40px, 7vw, 88px)',
            paddingLeft: 'clamp(22px, 6vw, 112px)',
            paddingRight: 'clamp(22px, 6vw, 112px)',
            minWidth: '0',
          })}
        >
          <p
            className={css({
              fontFamily: 'body',
              fontWeight: '600',
              fontSize: 'sm',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontVariantCaps: 'all-small-caps',
              color: 'accentAlt',
              marginBottom: '4',
              animationName: 'rise',
              animationDuration: '500ms',
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              animationFillMode: 'both',
              animationDelay: '80ms',
            })}
          >
            {eyebrow}
          </p>
          <h1
            className={cx(
              titleClassName,
              css({
                animationName: 'rise',
                animationDuration: '500ms',
                animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                animationFillMode: 'both',
                animationDelay: '0ms',
              })
            )}
          >
            {title}
          </h1>
        </div>
        <aside
          className={css({
            borderColor: 'borderStrong',
            borderTopStyle: 'solid',
            borderTopWidth: { base: '1px', lg: '0' },
            borderLeftStyle: 'solid',
            borderLeftWidth: { base: '0', lg: '1px' },
            paddingTop: 'clamp(28px, 6vw, 64px)',
            paddingBottom: 'clamp(28px, 6vw, 48px)',
            paddingLeft: 'clamp(22px, 6vw, 112px)',
            paddingRight: { base: 'clamp(22px, 6vw, 112px)', lg: 'clamp(48px, 4.5vw, 68px)' },
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
            minWidth: '0',
          })}
        >
          {meta}
          <SentenceNav className={css({ display: { base: 'none', lg: 'block' } })} />
        </aside>
      </div>
    </section>
  )
}
