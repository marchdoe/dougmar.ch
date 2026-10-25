import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

// Moon gradient substitutions as on home: amethyst 500 to borderStrong, amethyst 700 to field.
function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: 9999,
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bg',
          color: 'text',
          overflow: 'hidden',
        })}
      >
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            right: '-60px',
            bottom: '-40px',
            width: '480px',
            height: '480px',
            borderRadius: 'full',
            backgroundImage:
              'radial-gradient(circle at 38% 36%, token(colors.fieldInkMuted) 0%, token(colors.accentAlt) 18%, token(colors.accent) 38%, token(colors.borderStrong) 54%, token(colors.field) 68%, transparent 78%)',
          })}
        />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            height: '100%',
            paddingTop: '64px',
            paddingBottom: '56px',
            paddingLeft: '72px',
            paddingRight: '72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              lineHeight: '1.07',
              letterSpacing: '-0.005em',
              maxWidth: '700px',
            })}
          >
            <span className={css({ display: 'block', fontSize: '68px', color: 'text' })}>
              Dreams have only one owner at a time.
            </span>
            <span
              className={css({
                display: 'block',
                marginTop: '0.32em',
                fontSize: '40px',
                color: 'textMuted',
              })}
            >
              That’s why dreamers are{' '}
              <span className={css({ color: 'fieldInkMuted' })}>lonely</span>.
            </span>
          </h1>
          <div className={css({ color: 'text', display: 'flex' })}>
            <BrandLockup variant="stacked-md" mode="original" />
          </div>
        </div>
      </div>
    </div>
  )
}
