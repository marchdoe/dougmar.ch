import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: 9999,
        bg: 'field',
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
          bg: 'field',
          color: 'fieldInk',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <Ground material="dots" seed={1027631916} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            color: 'fieldInk',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          })}
        >
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
        <div className={css({ position: 'relative', zIndex: 1 })}>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: '80px',
              lineHeight: '1.04',
              color: 'fieldInk',
              maxWidth: '20ch',
            })}
          >
            None but ourselves can free our minds.
          </h1>
          <p
            className={css({
              marginTop: '16px',
              fontSize: '20px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'fieldInkMuted',
            })}
          >
            Bob Marley, Redemption Song
          </p>
        </div>
      </div>
    </div>
  )
}
