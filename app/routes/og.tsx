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
          display: 'flex',
          flexDirection: 'row',
        })}
      >
        <div
          className={css({
            flex: '1',
            minWidth: '0',
            paddingBlock: '64px',
            paddingInline: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          })}
        >
          <BrandLockup variant="stacked-md" mode="original" />
          <div>
            <h1
              className={css({
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'normal',
                fontVariant: 'all-small-caps',
                letterSpacing: 'wide',
                fontSize: '64px',
                lineHeight: '1.04',
                color: 'text',
                maxWidth: '780px',
              })}
            >
              The dream is free, but the hustle is sold separately.
            </h1>
            <span
              className={css({
                display: 'block',
                marginTop: '16px',
                fontFamily: 'body',
                fontSize: '22px',
                color: 'textMuted',
                letterSpacing: '0.01em',
              })}
            >
              Steve Harvey
            </span>
          </div>
        </div>
        <div
          className={css({
            width: '260px',
            flexShrink: 0,
            bg: 'field',
            borderLeftWidth: '6px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'accent',
          })}
        />
      </div>
    </div>
  )
}
