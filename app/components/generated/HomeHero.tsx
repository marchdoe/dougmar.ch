import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { Sky } from './Sky'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingTop: { base: 'clamp(32px, 8vw, 72px)', lg: 'clamp(40px, 6vw, 88px)' },
        paddingBottom: 'clamp(56px, 9vw, 96px)',
        paddingLeft: 'clamp(22px, 6vw, 112px)',
        paddingRight: 'clamp(22px, 6vw, 112px)',
        minHeight: { base: '70vh', lg: 'calc(100vh - 72px)' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      })}
    >
      <Ground material="dots" seed={625314833} />
      <Sky />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          maxWidth: { base: 'min(100%, 600px)', lg: 'min(100%, 820px)' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            lineHeight: '1.07',
            letterSpacing: '-0.005em',
            textAlign: 'left',
            textWrap: 'balance',
            margin: '0',
            animationName: 'rise',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: { base: 'clamp(30px, 8.6vw, 42px)', md: 'clamp(48px, 7vw, 96px)' },
              color: 'text',
            })}
          >
            Dreams have only one owner at a time.
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: '0.32em',
              fontSize: { base: 'clamp(22px, 5.2vw, 30px)', md: 'clamp(32px, 4.6vw, 52px)' },
              color: 'textMuted',
            })}
          >
            That’s why dreamers are{' '}
            <span className={css({ color: 'fieldInkMuted', fontStyle: 'italic' })}>lonely</span>.
          </span>
        </h1>
        <p
          className={css({
            marginTop: 'clamp(24px, 4vw, 38px)',
            fontFamily: 'body',
            fontWeight: '500',
            fontSize: '15px',
            letterSpacing: '0.02em',
            color: 'textMuted',
            animationName: 'rise',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '80ms',
          })}
        >
          William Faulkner
        </p>
      </div>
    </section>
  )
}
