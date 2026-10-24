import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const ghostWord = css({ display: 'block', fontSize: '190px', whiteSpace: 'nowrap' })

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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          paddingBlock: '56px',
          paddingInline: '64px',
          textAlign: 'center',
        })}
      >
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            transform: 'translateY(-50%)',
            fontFamily: 'display',
            lineHeight: '0.86',
            letterSpacing: '-0.02em',
            color: 'bgAlt',
            opacity: 0.18,
            textAlign: 'center',
            pointerEvents: 'none',
          })}
        >
          <span className={ghostWord}>DETROIT</span>
          <span className={ghostWord}>DETROIT</span>
          <span className={ghostWord}>DETROIT</span>
        </div>
        <BrandLockup
          variant="stacked-lg"
          mode="original"
          className={css({ position: 'relative', zIndex: 1 })}
        />
        <h1
          className={css({
            position: 'relative',
            zIndex: 1,
            fontWeight: 'normal',
            textAlign: 'center',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontSize: '160px',
              lineHeight: '0.88',
              letterSpacing: '-0.01em',
              color: 'text',
            })}
          >
            128–111
          </span>{' '}
          <span
            className={css({
              display: 'block',
              marginTop: '16px',
              marginInline: 'auto',
              maxWidth: '20ch',
              fontFamily: 'display',
              fontSize: '48px',
              lineHeight: '1',
              textTransform: 'uppercase',
              color: 'text',
            })}
          >
            Pistons run away with it
          </span>
        </h1>
      </div>
    </div>
  )
}
