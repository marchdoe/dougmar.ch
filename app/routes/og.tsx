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
          width: '1200px',
          height: '630px',
          overflow: 'hidden',
          bg: 'field',
          color: 'fieldInk',
          padding: '9',
        })}
      >
        <Ground material="mesh" seed={1975965606} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              textTransform: 'lowercase',
              color: 'fieldInk',
              fontSize: 'hero',
              lineHeight: 'tight',
              letterSpacing: 'tight',
              maxWidth: '18ch',
            })}
          >
            <span className={css({ color: 'accent' })}>ten years independent.</span> still the
            vehicle for the next experiment.
          </h1>
          <div
            className={css({
              fontFamily: 'display',
              fontSize: 'sm',
              color: 'fieldInkMuted',
              textTransform: 'lowercase',
            })}
          >
            doug march, design and engineering
          </div>
        </div>
      </div>
    </div>
  )
}
