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
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBlock: '56px',
          paddingInline: '64px',
        })}
      >
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
        <div
          aria-hidden="true"
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '200px',
            lineHeight: '0.86',
            letterSpacing: 'tight',
            color: 'fieldInk',
          })}
        >
          <span>104</span>
          <span className={css({ opacity: 0.72, fontWeight: 'normal' })}>{'\u2013'}</span>
          <span>86</span>
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: '60px',
            lineHeight: '1.03',
            color: 'fieldInk',
          })}
        >
          The Pistons held them to 86.
        </h1>
      </div>
    </div>
  )
}
