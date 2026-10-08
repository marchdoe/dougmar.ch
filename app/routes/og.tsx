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
          bg: 'bg',
          color: 'text',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderBottomWidth: '12px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'field',
        })}
      >
        <div className={css({ color: 'text' })}>
          <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
        </div>
        <h1 className={css({ textAlign: 'right', fontFamily: 'display' })}>
          <span
            className={css({
              display: 'block',
              fontWeight: 'normal',
              fontSize: '30px',
              lineHeight: '1.15',
              letterSpacing: 'tight',
              color: 'textMuted',
              maxWidth: '760px',
              marginLeft: 'auto',
              marginBottom: '14px',
            })}
          >
            If you want to find the secrets of the universe, think in terms of{' '}
          </span>
          <span
            className={css({
              display: 'block',
              fontWeight: 'bold',
              fontSize: '56px',
              lineHeight: '0.95',
              letterSpacing: 'tight',
              color: 'text',
            })}
          >
            energy, frequency and{' '}
          </span>
          <span
            className={css({
              display: 'block',
              fontWeight: 'bold',
              fontSize: '120px',
              lineHeight: '0.9',
              letterSpacing: 'tight',
              color: 'accent',
            })}
          >
            vibration.
          </span>
        </h1>
      </div>
    </div>
  )
}
