import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const words = ['Three ', 'tied ', 'at ', 'nine ']

function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: '9999',
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      })}
    >
      <div
        className={css({
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          bg: 'bgAlt',
          color: 'text',
          paddingBlock: '80px',
          paddingInline: '88px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div className={css({ display: 'flex', justifyContent: 'flex-end', color: 'text' })}>
          <BrandLockup variant="horizontal-md" mode="original" />
        </div>
        <h1
          className={css({
            display: 'flex',
            alignItems: 'flex-end',
            gap: '40px',
            fontWeight: 'normal',
          })}
        >
          <span
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              fontFamily: 'display',
              fontVariant: 'small-caps',
              letterSpacing: '.04em',
              fontSize: '48px',
              lineHeight: '1',
              color: 'text',
            })}
          >
            {words.map((w) => (
              <span key={w} className={css({ display: 'block' })}>
                {w}
              </span>
            ))}
            <span className={css({ display: 'block', color: 'accentAlt' })}>under.</span>
          </span>
          <span
            aria-hidden="true"
            className={css({
              fontFamily: 'display',
              fontSize: '220px',
              lineHeight: '0.82',
              letterSpacing: '-0.01em',
              color: 'accent',
            })}
          >
            {'\u22129'}
          </span>
        </h1>
      </div>
    </div>
  )
}
