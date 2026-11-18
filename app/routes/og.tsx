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
          boxSizing: 'border-box',
          flexShrink: 0,
          width: '1200px',
          height: '630px',
          bg: 'bg',
          color: 'text',
        })}
      >
        <div className={css({ position: 'absolute', top: '56px', left: '56px', zIndex: 3 })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <div
          className={css({
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingInline: '120px',
            zIndex: 2,
          })}
        >
          <p
            className={css({
              margin: '0',
              textAlign: 'center',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              textTransform: 'lowercase',
              fontSize: '88px',
              lineHeight: '1.02',
              letterSpacing: '-0.01em',
            })}
          >
            <span className={css({ display: 'block' })}>
              Bright, <span className={css({ color: 'fieldBorder' })}>42</span>, and
            </span>
            <span className={css({ display: 'block' })}>dark by five.</span>
          </p>
        </div>
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            height: '190px',
            bg: 'field',
            clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 100%)',
            zIndex: 1,
          })}
        />
      </div>
    </div>
  )
}
