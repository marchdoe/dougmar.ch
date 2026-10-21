import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { heroAttribution, heroPhrase } from '../components/generated/copy'

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
          flex: '0 0 auto',
          boxSizing: 'border-box',
          bg: 'field',
          color: 'fieldInk',
          paddingInline: '72px',
          paddingBlock: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '32px',
          })}
        >
          <span
            className={css({
              fontSize: '20px',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
            })}
          >
            The thesis
          </span>
          {/* On the gold field the full-colour mark fails 3:1, so it renders single-color in fieldInk. */}
          <BrandLockup
            variant="stacked-md"
            mode="single-color"
            roleLine
            className={css({ color: 'fieldInk', textAlign: 'right' })}
          />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '84px',
            lineHeight: '0.95',
            letterSpacing: 'normal',
            color: 'fieldInk',
            maxWidth: '1000px',
          })}
        >
          {heroPhrase}
        </h1>
        <span
          className={css({
            fontSize: '20px',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
          })}
        >
          {heroAttribution}
        </span>
      </div>
    </div>
  )
}
