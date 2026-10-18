import { css } from '../../../styled-system/css'
import { DriftGround } from './DriftGround'

const label = css({
  fontSize: '13px',
  fontVariant: 'small-caps',
  letterSpacing: 'wider',
  color: 'textMuted',
  bg: 'bg',
  width: 'fit-content',
})

export function HeroScore() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: { base: '72vh', lg: '82vh' },
        paddingTop: { base: '40px', lg: '80px' },
        paddingBottom: { base: '72px', lg: '160px' },
      })}
    >
      <DriftGround />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div className={css({ marginBottom: '24px' })}>
          <span className={label}>
            Detroit · Red Wings ·{' '}
            <span className={css({ color: { base: 'accent', _light: 'text' }, fontWeight: '500' })}>
              Final
            </span>
          </span>
        </div>
        <p
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            width: 'fit-content',
            bg: 'bg',
            paddingBlock: '12px',
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: 'clamp(5.5rem, 22vw, 10rem)', lg: 'clamp(96px, 14vw, 160px)' },
            lineHeight: '0.82',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {/* Light scheme: accent is 2.2:1 on bg; accentAlt (chartreuse.700) clears 3:1 at display size. */}
          <span className={css({ color: { base: 'accent', _light: 'accentAlt' } })}>4</span>
          <span
            className={css({
              color: 'textMuted',
              marginInline: '0.06em',
              fontSize: '0.6em',
              position: 'relative',
              top: '-0.2em',
            })}
          >
            {'\u2013'}
          </span>
          {/* Mockup ice stroke (#52A5E0) has no token; nearest semantic ink is textMuted. The stroke takes currentColor. */}
          <span
            className={css({
              color: 'textMuted',
              WebkitTextFillColor: 'transparent',
              WebkitTextStrokeWidth: '2.5px',
            })}
          >
            3
          </span>
        </p>
        {/* Flat bg ground on a static wrapper so the headline never sits on the mesh. */}
        <div
          className={css({
            marginTop: '28px',
            bg: 'bg',
            width: 'fit-content',
            paddingBlock: '8px',
            paddingRight: '16px',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: { base: '30px', lg: '44px' },
              lineHeight: '1.1',
              letterSpacing: '-0.01em',
              color: 'text',
              maxWidth: { base: '16ch', xl: '18ch' },
              width: 'fit-content',
              bg: 'bg',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            Red Wings edge it, 4–3
          </h1>
        </div>
        <p
          className={css({
            fontSize: 'clamp(18px, 2vw, 22px)',
            lineHeight: '1.45',
            color: 'textMuted',
            marginTop: '16px',
            maxWidth: '40ch',
            width: 'fit-content',
            bg: 'bg',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          One goal in it.
        </p>
        <div
          className={css({
            marginTop: '22px',
            display: 'flex',
            gap: '18px',
            flexWrap: 'wrap',
            alignItems: 'center',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          <span className={label}>
            Won by <span className={css({ color: 'text', fontWeight: '500' })}>one</span>
          </span>
          <span
            aria-hidden="true"
            className={css({ display: 'block', width: '1px', height: '12px', bg: 'borderStrong' })}
          />
          <span className={label}>Last night · Detroit</span>
        </div>
      </div>
    </section>
  )
}
