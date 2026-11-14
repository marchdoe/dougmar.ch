import { css } from '../../../styled-system/css'
import { Ledger } from './Ledger'

export function HeroBand() {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingBlock: 'clamp(28px, 4vw, 48px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <div
        className={css({
          display: { base: 'flex', md: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: { base: '32px', md: '0' },
          alignItems: { md: 'stretch' },
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: { base: 'flex-start', md: 'flex-end' },
            justifyContent: { md: 'center' },
            textAlign: { base: 'left', md: 'right' },
            paddingRight: { md: 'clamp(24px, 3vw, 56px)' },
            borderRightWidth: { md: '2px' },
            borderRightStyle: { md: 'solid' },
            borderRightColor: 'fieldBorder',
          })}
        >
          <h1
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: { base: 'flex-start', md: 'flex-end' },
            })}
          >
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: { base: '5xl', lg: 'hero' },
                lineHeight: '0.9',
                letterSpacing: '-0.02em',
                color: 'fieldInk',
                textTransform: 'lowercase',
                animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0ms',
              })}
            >
              sunny
            </span>{' '}
            <span
              className={css({
                display: 'block',
                marginTop: '12px',
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: { base: '28px', lg: '40px' },
                lineHeight: '1.1',
                color: 'fieldInk',
                whiteSpace: 'nowrap',
                animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '80ms',
              })}
            >
              36°,{' '}
              <span
                className={css({
                  fontSize: { base: '21px', lg: '30px' },
                  lineHeight: '1.1',
                  color: 'fieldInkMuted',
                })}
              >
                feels like 30
              </span>
            </span>
          </h1>
        </div>
        <Ledger />
      </div>
    </div>
  )
}
