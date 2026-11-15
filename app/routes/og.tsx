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
        zIndex: '9999',
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          boxSizing: 'border-box',
          flexShrink: '0',
          width: '1200px',
          height: '630px',
          bg: 'bg',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderBottomWidth: '12px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        <BrandLockup
          variant="stacked-md"
          mode="original"
          className={css({ alignSelf: 'flex-start' })}
        />
        <div>
          <div
            className={css({
              fontSize: 'xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
              fontWeight: 'bold',
              marginBottom: '16px',
            })}
          >
            Detroit Red Wings · final · 2–0
          </div>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'light',
              fontSize: '68px',
              lineHeight: '1.04',
              letterSpacing: 'tight',
              color: 'text',
              maxWidth: '1000px',
            })}
          >
            Nobody scored on the Red Wings.
          </h1>
        </div>
      </div>
    </div>
  )
}
