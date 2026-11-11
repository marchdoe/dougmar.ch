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
          position: 'relative',
          bg: 'bg',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5',
          textAlign: 'center',
        })}
      >
        <div className={css({ position: 'absolute', top: '56px', left: '56px', color: 'text' })}>
          <BrandLockup variant="stacked-md" mode="original" />
        </div>
        <div
          aria-hidden="true"
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            lineHeight: '0.9',
            fontSize: '150px',
            letterSpacing: '0.01em',
            color: 'transparent',
            WebkitTextStroke: '2px token(colors.textMuted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.04em',
          })}
        >
          <span>11</span>
          <span
            className={css({
              color: 'accent',
              WebkitTextStroke: '0',
              fontSize: '0.72em',
              transform: 'translateY(-0.06em)',
              marginInline: '0.02em',
              display: 'inline-block',
            })}
          >
            ●
          </span>
          <span>11</span>
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '88px',
            lineHeight: '1.02',
            color: 'text',
          })}
        >
          Veterans Day
        </h1>
        <div className={css({ width: '84px', height: '2px', bg: 'accent', opacity: 0.9 })} />
      </div>
    </div>
  )
}
