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
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBlock: '64px',
          paddingInline: '80px',
          borderBottomWidth: '24px',
          borderBottomStyle: 'solid',
          borderColor: 'field',
          boxSizing: 'border-box',
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          roleLine
          className={css({ alignSelf: 'flex-start', color: 'text' })}
        />
        <div className={css({ fontFamily: 'display', fontStyle: 'italic' })}>
          <span
            className={css({
              display: 'block',
              fontWeight: 'normal',
              fontSize: '44px',
              lineHeight: '1.08',
              color: 'textMuted',
              marginBottom: '0.12em',
            })}
          >
            What ships should look like what was
          </span>
          <span
            className={css({
              display: 'block',
              fontWeight: 'bold',
              fontSize: '150px',
              lineHeight: '0.9',
              letterSpacing: 'tight',
              color: 'accent',
            })}
          >
            Designed.
          </span>
        </div>
      </div>
    </div>
  )
}
