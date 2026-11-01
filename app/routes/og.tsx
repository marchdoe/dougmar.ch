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
          alignItems: 'flex-start',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '60px',
            lineHeight: '1.04',
            textTransform: 'uppercase',
            color: 'text',
            maxWidth: '1072px',
          })}
        >
          Loss is nothing else but change, and change is{' '}
          {/* mockup #f094a9 (rose.300) has no semantic token; accent is the nearest rose glow */}
          <span className={css({ color: 'accent', fontStyle: 'italic', textTransform: 'none' })}>
            nature’s delight.
          </span>
        </h1>
      </div>
    </div>
  )
}
