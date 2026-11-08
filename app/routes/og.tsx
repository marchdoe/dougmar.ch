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
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'field',
          color: 'fieldInk',
        })}
      >
        <div className={css({ position: 'absolute', top: '64px', left: '64px' })}>
          <BrandLockup variant="mark-only-md" mode={{ light: 'original', dark: 'single-color' }} />
        </div>
        <h1
          className={css({
            position: 'absolute',
            right: '64px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '580px',
            textAlign: 'right',
            textWrap: 'wrap',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              textTransform: 'uppercase',
              letterSpacing: '0.015em',
              lineHeight: '0.96',
              fontSize: '66px',
              color: 'surface',
              textAlign: 'justify',
              textAlignLast: 'justify',
            })}
          >
            Ben James leads at
          </span>{' '}
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '380px',
              lineHeight: '0.82',
              letterSpacing: '0.005em',
              color: 'fieldInk',
              marginTop: '4px',
              textAlign: 'justify',
              textAlignLast: 'justify',
            })}
          >
            − 21
          </span>
        </h1>
      </div>
    </div>
  )
}
