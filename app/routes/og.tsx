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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          px: '9',
          py: '9',
        })}
      >
        <Ground material="dots" seed={1959335082} />
        <div className={css({ position: 'relative', zIndex: 1 })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <div className={css({ position: 'relative', zIndex: 1 })}>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textStyle: 'hero',
              lineHeight: 'tight',
              color: 'fieldInk',
              maxWidth: '11ch',
            })}
          >
            Closing the gap between what gets designed and what gets built.
          </h1>
        </div>
      </div>
    </div>
  )
}
