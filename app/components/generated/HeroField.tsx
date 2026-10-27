import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { ScorePanel } from './ScorePanel'

// The ruled ground stops at the headline block, so the score panel sits on a flat ground.
// Headline spans carry a bg fill on their own boxes so no rule runs through the glyphs.
export function HeroField() {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        lg: { minHeight: '88vh' },
      })}
    >
      <div className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
        <Ground material="rule" seed={658870071} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            paddingTop: 'clamp(28px, 6vw, 72px)',
            paddingInline: 'clamp(18px, 6vw, 96px)',
            paddingBottom: 'clamp(20px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <div
            className={css({
              alignSelf: 'flex-end',
              textAlign: 'right',
              maxWidth: '30ch',
              fontFamily: 'body',
              fontSize: 'xs',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'textMuted',
              fontWeight: 'bold',
              marginBottom: '10px',
              bg: 'bg',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            Weekend scoreboard · Detroit
          </div>
          <h1
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px',
              width: '100%',
              textTransform: 'lowercase',
              textAlign: 'right',
              fontStyle: 'italic',
              color: 'text',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: { base: '72px', lg: '160px' },
                lineHeight: '0.86',
                letterSpacing: '-0.02em',
                textAlign: 'right',
                bg: 'bg',
              })}
            >
              Detroit
            </span>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: { base: '26px', lg: '40px' },
                lineHeight: '1.05',
                letterSpacing: '-0.01em',
                textAlign: 'right',
                maxWidth: '16ch',
                marginTop: '6px',
                bg: 'bg',
                animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '80ms',
              })}
            >
              went two for two this weekend
            </span>
          </h1>
        </div>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flex: '1',
          bg: 'bg',
          paddingTop: 'clamp(8px, 1vw, 16px)',
          paddingInline: 'clamp(18px, 6vw, 96px)',
          paddingBottom: 'clamp(36px, 5vw, 72px)',
        })}
      >
        <ScorePanel />
      </div>
    </section>
  )
}
