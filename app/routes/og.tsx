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
          bg: 'bg',
          color: 'text',
        })}
      >
        <div className={css({ position: 'absolute', top: '56px', left: '56px', color: 'text' })}>
          <BrandLockup variant="stacked-lg" mode="single-color" />
        </div>
        <h1
          className={css({
            position: 'absolute',
            right: '64px',
            bottom: '56px',
            maxWidth: '640px',
            textAlign: 'right',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'light',
              fontSize: '200px',
              lineHeight: '0.86',
              letterSpacing: '-0.01em',
              color: 'text',
            })}
          >
            Mind
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: '20px',
              marginLeft: 'auto',
              maxWidth: '16ch',
              fontFamily: 'body',
              fontWeight: 'normal',
              fontSize: '40px',
              lineHeight: '1.25',
              letterSpacing: '-0.01em',
              color: 'textMuted',
            })}
          >
            Make your mind your own business.
            <span
              className={css({
                display: 'block',
                marginTop: '10px',
                fontSize: '22px',
                letterSpacing: 'normal',
                color: 'text',
              })}
            >
              Jack Butcher
            </span>
          </span>
        </h1>
      </div>
    </div>
  )
}
