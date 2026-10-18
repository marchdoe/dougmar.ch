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
        bg: 'field',
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
        <div className={css({ alignSelf: 'flex-start', color: 'fieldInk' })}>
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
        <div className={css({ alignSelf: 'flex-end', textAlign: 'right', maxWidth: '980px' })}>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '58px',
              lineHeight: '1.04',
              letterSpacing: '0.008em',
              textTransform: 'uppercase',
              color: 'fieldInk',
            })}
          >
            If you're waiting until you feel talented enough to make it, you'll{' '}
            {/* mockup gold (amber.400) has no semantic token; fieldInkMuted is the nearest light accent ink on field */}
            <span className={css({ color: 'fieldInkMuted' })}>never make it.</span>
          </h1>
          <p
            className={css({
              marginTop: '20px',
              fontFamily: 'body',
              fontSize: '16px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
            })}
          >
            Criss Jami
          </p>
        </div>
      </div>
    </div>
  )
}
