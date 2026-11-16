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
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          bg: 'bg',
          color: 'text',
          fontFamily: 'body',
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingInline: '72px',
            paddingBlock: '64px',
            minWidth: '0',
          })}
        >
          <div
            className={css({
              fontSize: '20px',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'textMuted',
              marginBottom: '32px',
            })}
          >
            Detroit · Week 11
          </div>
          <h1
            className={css({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '156px',
                lineHeight: '0.9',
                color: 'text',
              })}
            >
              Lions
            </span>
            <span
              className={css({
                display: 'block',
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '68px',
                lineHeight: '1',
                marginTop: '24px',
                color: 'text',
              })}
            >
              by <span className={css({ color: 'accent' })}>25</span>
            </span>
          </h1>
        </div>
        <div
          className={css({
            bg: 'field',
            color: 'fieldInk',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBlock: '64px',
            paddingInline: '48px',
          })}
        >
          <BrandLockup variant="mark-only-md" mode={{ light: 'original', dark: 'single-color' }} />
          <div
            className={css({
              fontSize: '20px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'fieldInkMuted',
            })}
          >
            Final · <span className={css({ color: 'fieldInk' })}>35–10</span>
          </div>
        </div>
      </div>
    </div>
  )
}
