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
        zIndex: '9999',
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          display: 'grid',
          gridTemplateColumns: '700px 500px',
        })}
      >
        <div
          className={css({
            bg: 'field',
            color: 'fieldInk',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBlock: '48px',
            paddingInline: '56px',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              fontSize: '96px',
              lineHeight: '1',
              letterSpacing: '-0.015em',
              textAlign: 'right',
              color: 'fieldInk',
            })}
          >
            Designed and shipped by the same hands.
          </h1>
        </div>
        <div
          className={css({ bg: 'bg', color: 'text', paddingBlock: '56px', paddingInline: '48px' })}
        >
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
      </div>
    </div>
  )
}
