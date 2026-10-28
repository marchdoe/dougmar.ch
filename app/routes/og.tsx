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
          minWidth: '1200px',
          minHeight: '630px',
          maxHeight: '630px',
          boxSizing: 'border-box',
          flexShrink: 0,
          position: 'relative',
          bg: 'bg',
          color: 'text',
          fontFamily: 'display',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '64px',
            left: '64px',
            color: 'text',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        <div
          className={css({
            position: 'absolute',
            left: '64px',
            right: '64px',
            bottom: '64px',
            textAlign: 'center',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: 'md',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'widest',
              color: 'textMuted',
              marginBottom: '3',
            })}
          >
            Humidity · Aldie, 98%
          </span>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'light',
              fontSize: '60px',
              lineHeight: '1.05',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: 'text',
              maxWidth: '1000px',
              marginInline: 'auto',
            })}
          >
            Fog, fifty degrees, calm.
          </h1>
        </div>
      </div>
    </div>
  )
}
