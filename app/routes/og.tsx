import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { heroBreak, heroCite, heroLead } from '../components/generated/heroPhrase'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: 9999,
        bg: 'field',
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
          padding: '72px',
          boxSizing: 'border-box',
        })}
      >
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="stacked-md" mode="original" />
        </div>
        <div>
          <h1 className={css({ fontFamily: 'display', fontWeight: 'light', textAlign: 'left' })}>
            <span
              className={css({
                display: 'block',
                fontStyle: 'italic',
                fontSize: '56px',
                lineHeight: 'snug',
                color: 'fieldInk',
                maxWidth: '1000px',
              })}
            >
              {heroLead}
            </span>
            <span
              className={css({
                display: 'block',
                fontSize: '56px',
                lineHeight: 'tight',
                color: 'accent',
                WebkitTextFillColor: 'transparent',
                WebkitTextStrokeColor: 'currentColor',
                WebkitTextStrokeWidth: '2px',
              })}
            >
              {heroBreak}
            </span>
          </h1>
          <div
            className={css({
              marginTop: '3',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontSize: 'lg',
              color: 'fieldInkMuted',
            })}
          >
            {heroCite}
          </div>
        </div>
      </div>
    </div>
  )
}
