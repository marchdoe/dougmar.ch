import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { TopLockup } from './TopLockup'

export function AboutHero() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'text',
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1.15fr 0.85fr' },
        gridTemplateRows: { lg: 'auto 1fr' },
        columnGap: { lg: '4vw' },
        rowGap: { base: '28px', lg: '24px' },
        paddingTop: { base: '28px', lg: '40px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <TopLockup />
      <div
        className={css({
          gridColumn: { lg: '1' },
          gridRow: { lg: '1 / span 2' },
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        })}
      >
        <span
          className={css({
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '.14em',
            color: 'textMuted',
          })}
        >
          About
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: 'clamp(30px, 3.4vw, 44px)',
            lineHeight: '1.02',
            letterSpacing: '.02em',
            maxWidth: '30ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
      <div
        className={css({
          gridColumn: { lg: '2' },
          gridRow: { lg: '2' },
          alignSelf: { lg: 'end' },
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: { lg: 'right' },
        })}
      >
        <span className={css({ fontFamily: 'display', fontSize: '30px', letterSpacing: '.02em' })}>
          {identity.name}
        </span>
        <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{identity.role}</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            textStyle: 'sm',
            fontWeight: 'bold',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: { lg: 'flex-end' },
          })}
        >
          {identity.email}
        </a>
      </div>
    </section>
  )
}
