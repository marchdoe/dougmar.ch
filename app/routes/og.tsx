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
          padding: '64px',
        })}
      >
        <Ground material="rule" seed={2143888891} />
        <div className={css({ position: 'relative', zIndex: 1 })}>
          <p
            className={css({
              fontWeight: 'bold',
              fontSize: 'sm',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'accent',
              marginBottom: '6',
            })}
          >
            Design &amp; Engineering
          </p>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'hero',
              color: 'fieldInk',
              maxWidth: '18ch',
            })}
          >
            Buildable before the first line of code. Faithful after the last.
          </h1>
        </div>
        <div className={css({ position: 'relative', zIndex: 1, color: 'fieldInk' })}>
          <BrandLockup variant="stacked-md" mode="original" roleLine />
        </div>
      </div>
    </div>
  )
}
