import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { ActPhrase } from '../components/generated/ActPhrase'

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
          gridTemplateColumns: '840px 360px',
          bg: 'bg',
        })}
      >
        <div
          className={css({
            padding: '64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'text',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '50px',
              lineHeight: '1.12',
              letterSpacing: 'wide',
              fontVariant: 'small-caps',
              textAlign: 'justify',
              color: 'text',
            })}
          >
            <ActPhrase />
          </h1>
        </div>
        <div
          className={css({
            bg: 'field',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '48px',
          })}
        >
          <span
            aria-hidden="true"
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '140px',
              lineHeight: '0.8',
              letterSpacing: 'tight',
              color: 'fieldInkMuted',
              opacity: 0.18,
            })}
          >
            ACT
          </span>
        </div>
      </div>
    </div>
  )
}
