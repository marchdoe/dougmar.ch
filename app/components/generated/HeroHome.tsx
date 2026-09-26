import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

export function HeroHome() {
  return (
    <header
      className={css({
        position: 'relative',
        minHeight: '92vh',
        overflow: 'hidden',
        bg: 'bg',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1.4fr' },
        gridTemplateRows: 'auto 1fr auto',
        paddingTop: { base: '24px', md: '34px', lg: '44px' },
        paddingBottom: { base: '40px', md: '48px', lg: '56px' },
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
      })}
    >
      <div
        className={css({
          gridRow: '1',
          gridColumn: { lg: '1' },
          alignSelf: 'start',
          zIndex: 3,
          color: 'text',
          width: 'max-content',
        })}
      >
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>

      <div
        className={css({
          gridRow: { base: '2', lg: '1 / span 3' },
          gridColumn: { lg: '2' },
          position: 'relative',
          marginTop: { base: '20px', lg: '0' },
          borderRadius: 'md',
          bg: 'field',
          overflow: 'hidden',
          display: 'grid',
          alignContent: 'end',
          minHeight: { base: '56vh', lg: 'auto' },
          paddingTop: { base: '28px', lg: '44px' },
          paddingBottom: { base: '30px', lg: '46px' },
          paddingInline: { base: '22px', lg: '48px' },
        })}
      >
        <Ground material="dots" seed={1875299892} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          <div
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              marginBottom: '4px',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'fieldInkMuted',
              })}
            >
              Detroit
            </span>
            {/* gold700 label substituted with fieldInkMuted */}
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'fieldInkMuted',
              })}
            >
              Final · Fri
            </span>
          </div>
          <div
            className={css({
              fontFamily: 'display',
              textStyle: 'hero',
              lineHeight: '0.9',
              color: 'accent',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 0 44px color-mix(in srgb, var(--colors-field-ink) 28%, transparent)',
            })}
          >
            8–7
          </div>
        </div>
      </div>

      <div
        className={css({
          gridRow: '3',
          gridColumn: { lg: '1' },
          alignSelf: { lg: 'end' },
          position: 'relative',
          zIndex: 2,
          marginTop: { base: '22px', lg: '0' },
          paddingBottom: { lg: '8px' },
          paddingRight: { lg: '5' },
          textAlign: { base: 'right', lg: 'left' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            textStyle: '3xl',
            lineHeight: '1.02',
            fontWeight: 'normal',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'text',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          Tigers, by one.
        </h1>
        <p
          className={css({
            fontSize: 'lg',
            color: 'textMuted',
            marginTop: '2',
            marginBottom: '0',
            maxWidth: { lg: '34ch' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          One run stood up.
        </p>
        {/* gold700 status substituted with textFaint for contrast on bg */}
        <div
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'textFaint',
            marginTop: '14px',
            '& b': { color: 'accent' },
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          Held to the last out · Tigers <b>8</b>, visitors <b>7</b>
        </div>
      </div>
    </header>
  )
}
