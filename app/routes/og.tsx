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
          flexShrink: '0',
          bg: 'bg',
        })}
      >
        <h1
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
            height: '100%',
            fontSize: '16px',
            fontWeight: 'normal',
          })}
        >
          <span
            className={css({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '3',
              bg: 'bg',
              padding: '56px',
            })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: '140px',
                lineHeight: '0.9',
                letterSpacing: 'tight',
                color: 'text',
              })}
            >
              Clear
            </span>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: '56px',
                lineHeight: '1',
                color: 'text',
              })}
            >
              all day
            </span>
          </span>
          <span
            className={css({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              bg: 'field',
              padding: '56px',
            })}
          >
            {/* Moon gradient rebuilt as token discs. */}
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className={css({ width: '120px', height: '120px', display: 'block' })}
            >
              <circle cx="50" cy="50" r="48" className={css({ fill: 'accentAlt' })} />
              <circle cx="49" cy="49" r="46" className={css({ fill: 'fieldInkMuted' })} />
              <circle cx="47" cy="46" r="37" className={css({ fill: 'bgAlt' })} />
              <circle cx="44" cy="42" r="22" className={css({ fill: 'surface' })} />
            </svg>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: '60px',
                lineHeight: '1',
                color: 'fieldInk',
              })}
            >
              full moon all night.
            </span>
          </span>
        </h1>
        <div className={css({ position: 'absolute', top: '56px', left: '56px', color: 'text' })}>
          <BrandLockup variant="stacked-md" mode="single-color" />
        </div>
      </div>
    </div>
  )
}
