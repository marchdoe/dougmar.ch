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
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
        })}
      >
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <h1 className={css({ textAlign: 'right', lineHeight: '1' })}>
          <span
            className={css({
              display: 'block',
              fontFamily: 'body',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              fontSize: '16px',
              color: 'accentAlt',
              marginBottom: '3',
            })}
          >
            Doug March
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '80px',
              lineHeight: '1',
              letterSpacing: 'tight',
              color: 'fieldInk',
              marginBottom: '3',
            })}
          >
            Ten years independent.
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '42px',
              lineHeight: '1.12',
              color: 'fieldInk',
            })}
          >
            Still the vehicle for the next experiment.
          </span>
        </h1>
      </div>
    </div>
  )
}
