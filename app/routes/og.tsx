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
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bg',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          paddingInline: '80px',
          paddingBlock: '64px',
          textAlign: 'center',
        })}
      >
        <div className={css({ position: 'absolute', top: '56px', left: '56px' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <div
          aria-hidden="true"
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '0.82',
            letterSpacing: '-0.01em',
            fontSize: '230px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '0.04em',
          })}
        >
          <span className={css({ color: 'accent' })}>5</span>
          <span
            className={css({
              color: 'textMuted',
              fontWeight: 'normal',
              fontSize: '0.6em',
              transform: 'translateY(-0.12em)',
            })}
          >
            {'\u2013'}
          </span>
          {/* steel #72819f maps to textFaint; stroke reads currentColor */}
          <span
            className={css({
              color: 'textFaint',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '5px currentColor',
            })}
          >
            3
          </span>
        </div>
        <div aria-hidden="true" className={css({ width: '420px', height: '2px', bg: 'accent' })} />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'lowercase',
            fontSize: '64px',
            lineHeight: '0.95',
            color: 'textMuted',
          })}
        >
          <b className={css({ color: 'text', fontWeight: 'bold' })}>Red Wings</b> take it, 5–3.
        </h1>
      </div>
    </div>
  )
}
