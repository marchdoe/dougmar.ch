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
        inset: 0,
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
          overflow: 'hidden',
          width: '1200px',
          height: '630px',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '8',
        })}
      >
        <Ground material="rule" seed={1942557463} />
        <div className={css({ position: 'relative', zIndex: 1 })}>
          <BrandLockup
            variant="stacked-md"
            mode="original"
            roleLine
            className={css({ color: 'fieldInk' })}
          />
        </div>
        <h1
          className={css({
            position: 'relative',
            zIndex: 1,
            textStyle: 'hero',
            fontFamily: 'display',
            fontWeight: 'bold',
            color: 'fieldInk',
            maxWidth: '18ch',
          })}
        >
          Most golf apps are digital scorecards. This one is not.
        </h1>
        <p
          className={css({
            position: 'relative',
            zIndex: 1,
            fontSize: 'lg',
            color: 'fieldInkMuted',
            maxWidth: '50ch',
          })}
        >
          15th Club reads the round, not the total.
        </p>
      </div>
    </div>
  )
}
