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
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bgAlt',
          color: 'text',
          paddingTop: '72px',
          paddingRight: '80px',
          paddingBottom: '88px',
          paddingLeft: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          textAlign: 'right',
        })}
      >
        <div className={css({ position: 'absolute', top: '64px', left: '72px' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <span
          className={css({
            fontFamily: 'body',
            fontSize: '16px',
            letterSpacing: 'wider',
            textTransform: 'lowercase',
            color: 'textMuted',
            marginBottom: '24px',
          })}
        >
          doug march · 15th club
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: '76px',
            lineHeight: '1.08',
            letterSpacing: 'normal',
            textTransform: 'lowercase',
            maxWidth: '980px',
            color: 'text',
          })}
        >
          Most golf apps are digital scorecards. This one is not.
        </h1>
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            height: '20px',
            bg: 'field',
          })}
        />
      </div>
    </div>
  )
}
