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
          isolation: 'isolate',
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bg',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        })}
      >
        {/* ember glow: mockup's accent-at-20% radial maps to bgAlt through a radial mask */}
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            inset: '0',
            zIndex: -1,
            bg: 'bgAlt',
            maskImage: 'radial-gradient(44% 42% at 88% 94%, black 0%, transparent 62%)',
          })}
        />
        <div className={css({ color: 'text' })}>
          <BrandLockup variant="mark-only-md" mode="single-color" />
        </div>
        <h1 className={css({ display: 'block', textAlign: 'left', maxWidth: '1040px' })}>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              textTransform: 'lowercase',
              fontSize: '144px',
              lineHeight: '0.86',
              letterSpacing: 'tight',
              color: 'accent',
            })}
          >
            thousands
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: '20px',
              maxWidth: '900px',
              fontFamily: 'body',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '30px',
              lineHeight: 'snug',
              color: 'text',
            })}
          >
            of kids practicing spelling from the list the teacher sent home.
          </span>
        </h1>
      </div>
    </div>
  )
}
