import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

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
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          minHeight: '630px',
          maxHeight: '630px',
          flexShrink: 0,
          bg: 'bg',
          color: 'text',
          fontFamily: 'body',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '64px',
            left: '72px',
            color: { base: 'accent', _light: 'accentAlt' },
          })}
        >
          {/* Full colour: on bg its blue reaches 3.4:1 in light (warmblack.50), the card's scheme. */}
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <div
          className={css({
            position: 'absolute',
            left: '72px',
            right: '72px',
            bottom: '64px',
          })}
        >
          <p
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '150px',
              lineHeight: '1',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {/* Light scheme: accentAlt (chartreuse.700) clears 3:1 where accent does not. */}
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
                WebkitTextStrokeWidth: '3px',
              })}
            >
              3
            </span>
          </p>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '52px',
              lineHeight: '1.08',
              letterSpacing: '-0.01em',
              color: 'text',
              marginTop: '20px',
            })}
          >
            Red Wings edge it, 4–3
          </h1>
        </div>
      </div>
    </div>
  )
}
