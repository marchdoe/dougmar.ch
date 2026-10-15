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
          flex: '0 0 auto',
          bg: 'bg',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        })}
      >
        <div className={css({ color: 'textMuted' })}>
          <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
        </div>
        <div>
          <h1
            className={css({
              fontFamily: 'display',
              fontSize: '92px',
              fontWeight: 'light',
              lineHeight: '1',
              letterSpacing: 'tight',
              color: 'text',
            })}
          >
            <span className={css({ display: 'block' })}>Just get out</span>
            <span className={css({ display: 'block' })}>and do it.</span>
          </h1>
          <div
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              fontSize: 'lg',
              letterSpacing: 'wide',
              color: 'accentAlt',
              marginTop: '4',
            })}
          >
            Christopher McCandless
          </div>
        </div>
      </div>
    </div>
  )
}
