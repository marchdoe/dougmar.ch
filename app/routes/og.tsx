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
          flexShrink: '0',
          display: 'grid',
          gridTemplateRows: '1fr 330px',
          bg: 'bg',
          fontFamily: 'body',
        })}
      >
        <div
          className={css({
            bg: 'bg',
            backgroundImage:
              'linear-gradient(to bottom, {colors.bg} 0%, {colors.bgAlt} 42%, color-mix(in srgb, {colors.accent} 22%, {colors.bg}) 76%, color-mix(in srgb, {colors.accent} 45%, {colors.bg}) 100%)',
            paddingTop: '56px',
            paddingInline: '64px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" className={css({ color: 'text' })} />
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
            })}
          >
            <span className={css({ fontFamily: 'display', fontSize: '24px', color: 'text' })}>
              Aldie, Virginia
            </span>
            <span className={css({ fontSize: '18px', color: 'textMuted' })}>Sat, Nov 14, 2026</span>
          </div>
        </div>
        <div
          className={css({
            bg: 'field',
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
            paddingInline: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          })}
        >
          <h1
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
            })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: '168px',
                lineHeight: '0.9',
                letterSpacing: '-0.02em',
                color: 'fieldInk',
                textTransform: 'lowercase',
              })}
            >
              sunny
            </span>{' '}
            <span
              className={css({
                display: 'block',
                marginTop: '12px',
                fontFamily: 'display',
                fontSize: '44px',
                lineHeight: '1.1',
                color: 'fieldInk',
                whiteSpace: 'nowrap',
              })}
            >
              36°,{' '}
              <span className={css({ fontSize: '34px', color: 'fieldInkMuted' })}>
                feels like 30
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}
