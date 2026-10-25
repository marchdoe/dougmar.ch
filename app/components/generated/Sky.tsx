import { css } from '../../../styled-system/css'

// Moon gradient substitutions: mockup #9a52c8 (amethyst 500) maps to borderStrong,
// #682c89 (amethyst 700) maps to field, #dcc0ee glow maps to fieldInkMuted.
export function Sky() {
  return (
    <div
      aria-hidden="true"
      data-allow-x-overflow="true"
      className={css({
        position: 'absolute',
        inset: '-4%',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
      })}
    >
      <div
        data-allow-x-overflow="true"
        className={css({
          position: 'absolute',
          right: '-18vw',
          bottom: { base: '-14vw', lg: '-10vh' },
          width: { base: 'clamp(420px, 92vw, 1000px)', lg: 'clamp(560px, 64vw, 1040px)' },
          aspectRatio: '1 / 1',
          borderRadius: 'full',
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, token(colors.borderStrong) 40%, transparent) 0%, color-mix(in srgb, token(colors.field) 20%, transparent) 40%, transparent 66%)',
        })}
      />
      <div
        data-allow-x-overflow="true"
        className={css({
          position: 'absolute',
          right: { base: '-4vw', lg: '-8vw' },
          bottom: { base: '6vw', lg: '5vh' },
          width: { base: 'clamp(240px, 58vw, 620px)', lg: 'clamp(320px, 34vw, 580px)' },
          aspectRatio: '1 / 1',
          borderRadius: 'full',
          backgroundImage:
            'radial-gradient(circle at 38% 36%, token(colors.fieldInkMuted) 0%, token(colors.accentAlt) 18%, token(colors.accent) 38%, token(colors.borderStrong) 54%, token(colors.field) 68%, transparent 78%)',
        })}
      />
    </div>
  )
}
