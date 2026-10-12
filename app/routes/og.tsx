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
          flex: '0 0 auto',
          boxSizing: 'border-box',
          bg: 'bg',
          color: 'text',
          borderTopWidth: '12px',
          borderTopStyle: 'solid',
          borderTopColor: 'accent',
          paddingTop: '52px',
          paddingBottom: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
        <div
          className={css({
            bg: 'bgAlt',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
            paddingBlock: '28px',
            paddingInline: '32px',
          })}
        >
          <p
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontSize: '46px',
              lineHeight: '1.12',
              maxWidth: '980px',
              color: 'text',
            })}
          >
            Spend eighty percent of your time focusing on the opportunities of tomorrow rather than
            the problems of yesterday.
          </p>
          <p
            className={css({
              marginTop: '16px',
              fontFamily: 'body',
              fontWeight: 'bold',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wider',
              fontSize: 'lg',
              color: 'textMuted',
            })}
          >
            Brian Tracy
          </p>
        </div>
      </div>
    </div>
  )
}
