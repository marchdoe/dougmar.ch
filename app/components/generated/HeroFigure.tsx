import { css } from '../../../styled-system/css'

export function HeroFigure() {
  return (
    <div className={css({ paddingTop: 'clamp(60px, 14vh, 160px)', textAlign: 'center' })}>
      <span
        className={css({
          display: 'inline-block',
          bg: 'bg',
          paddingInline: '3',
          paddingBlock: '1',
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '18px',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Humidity · Aldie
      </span>
      {/* figure: mockup accentAlt; light scheme falls to accent so it clears 3:1 on the pale ground */}
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'light',
          fontSize: 'clamp(80px, 8.4vw, 120px)',
          letterSpacing: 'tight',
          lineHeight: '0.92',
          color: { base: 'accentAlt', _light: 'accent' },
          fontVariantNumeric: 'tabular-nums',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        98%
      </span>
      <div
        aria-hidden="true"
        className={css({
          width: 'clamp(120px, 22vw, 320px)',
          height: '2px',
          bg: 'borderStrong',
          marginTop: '22px',
          marginBottom: '26px',
          marginInline: 'auto',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      />
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          textStyle: '2xl',
          lineHeight: 'tight',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'text',
          maxWidth: '14ch',
          marginInline: 'auto',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Fog, fifty degrees, calm.
      </h1>
      {/* deck: mockup accentAlt; light scheme uses textMuted for body-size contrast; flat bg ground over the mesh */}
      <p
        className={css({
          marginTop: '22px',
          marginInline: 'auto',
          bg: 'bg',
          paddingInline: '3',
          paddingBlock: '2',
          textStyle: 'lede',
          lineHeight: 'normal',
          color: { base: 'accentAlt', _light: 'textMuted' },
          maxWidth: '40ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        98% humidity over Aldie. Wind 2{'\u00a0'}mph, east. Sunrise 7:41.
      </p>
    </div>
  )
}
