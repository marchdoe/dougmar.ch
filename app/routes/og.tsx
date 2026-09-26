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
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          boxSizing: 'border-box',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBlock: '64px',
          paddingInline: '72px',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          })}
        >
          <div className={css({ color: 'fieldInk' })}>
            <BrandLockup variant="stacked-md" mode="single-color" />
          </div>
          <div
            className={css({
              fontFamily: 'display',
              fontSize: '160px',
              lineHeight: '0.9',
              color: 'accent',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            8–7
          </div>
        </div>
        <div className={css({ textAlign: 'right' })}>
          <h1
            className={css({
              fontFamily: 'display',
              fontSize: '96px',
              lineHeight: '1',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'fieldInk',
            })}
          >
            Tigers, by one.
          </h1>
          <div className={css({ marginTop: '16px', fontSize: '28px', color: 'fieldInkMuted' })}>
            One run stood up.
          </div>
        </div>
      </div>
    </div>
  )
}
