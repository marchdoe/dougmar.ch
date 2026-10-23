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
        <BrandLockup variant="horizontal-md" mode="original" roleLine />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            textTransform: 'lowercase',
            textAlign: 'left',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: '60px',
              lineHeight: '0.98',
              letterSpacing: '-0.02em',
              color: 'textMuted',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1.6px currentColor',
              marginBottom: '8px',
            })}
          >
            most golf apps are
            <br />
            digital scorecards.
          </span>
          <span
            className={css({
              display: 'block',
              fontSize: '104px',
              lineHeight: '0.92',
              letterSpacing: '-0.035em',
              color: 'accent',
            })}
          >
            this one is not.
          </span>
        </h1>
      </div>
    </div>
  )
}
