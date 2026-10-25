import { css } from '../../../styled-system/css'
import { SentenceNav } from './SentenceNav'

export function NightRail() {
  return (
    <aside
      className={css({
        position: 'relative',
        zIndex: 3,
        bg: 'bg',
        borderColor: 'borderStrong',
        borderTopStyle: 'solid',
        borderTopWidth: { base: '1px', lg: '0' },
        borderLeftStyle: 'solid',
        borderLeftWidth: { base: '0', lg: '1px' },
        paddingTop: 'clamp(28px, 6vw, 40px)',
        paddingBottom: 'clamp(28px, 6vw, 40px)',
        paddingLeft: 'clamp(22px, 6vw, 112px)',
        paddingRight: { base: 'clamp(22px, 6vw, 112px)', lg: 'clamp(48px, 4.5vw, 68px)' },
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        aria-hidden="true"
        className={css({
          display: { base: 'none', lg: 'block' },
          position: 'absolute',
          top: 'clamp(48px, 9vw, 110px)',
          right: '20px',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontFamily: 'body',
          fontWeight: '600',
          fontSize: '16px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontVariantCaps: 'all-small-caps',
          color: 'textMuted',
        })}
      >
        William Faulkner
      </span>
      <div className={css({ marginTop: { lg: 'clamp(28px, 5vw, 64px)' } })}>
        <p
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
          Tonight
        </p>
        <p
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: { base: 'clamp(19px, 4.5vw, 22px)', lg: '22px' },
            lineHeight: '1.4',
            color: 'text',
            maxWidth: '28ch',
          })}
        >
          Full moon over Aldie. 43° and clear.
        </p>
      </div>
      <SentenceNav
        className={css({
          display: { base: 'none', lg: 'block' },
          marginTop: { lg: 'clamp(40px, 8vh, 96px)' },
        })}
      />
    </aside>
  )
}
