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
          bg: 'bg',
          color: 'text',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div className={css({ alignSelf: 'flex-start', color: 'text' })}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
        <h1
          className={css({
            alignSelf: 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            gap: '24px',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '180px',
              lineHeight: '0.85',
              letterSpacing: '-0.04em',
              textTransform: 'lowercase',
              color: 'accent',
            })}
          >
            one
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'semibold',
              fontSize: '50px',
              lineHeight: '1.08',
              letterSpacing: '-0.01em',
              textTransform: 'lowercase',
              color: 'text',
              maxWidth: '22ch',
            })}
          >
            Design and engineering as one job, not two teams passing files.
          </span>
        </h1>
      </div>
    </div>
  )
}
