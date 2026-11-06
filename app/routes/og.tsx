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
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5',
          paddingInline: '8',
          textAlign: 'center',
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          className={css({ position: 'absolute', top: '56px', left: '56px' })}
        />
        <h1
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4',
            fontWeight: 'light',
            marginTop: '7',
          })}
        >
          <span
            className={css({
              display: 'block',
              whiteSpace: 'nowrap',
              fontFamily: 'display',
              fontWeight: 'light',
              textStyle: 'hero',
              lineHeight: 'tight',
              color: 'transparent',
              WebkitTextStroke: '2px token(colors.accent)',
            })}
          >
            Spaceman
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'body',
              fontWeight: 'normal',
              textStyle: '2xl',
              color: 'fieldInk',
            })}
          >
            FishSticks, 15th Club, and the next one.
          </span>
        </h1>
      </div>
    </div>
  )
}
