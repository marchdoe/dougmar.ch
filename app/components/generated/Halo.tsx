import { css } from '../../../styled-system/css'

export function Halo() {
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
          bottom: '-30vw',
          width: { base: 'clamp(420px, 92vw, 1000px)', lg: 'clamp(560px, 56vw, 960px)' },
          aspectRatio: '1 / 1',
          borderRadius: 'full',
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, token(colors.borderStrong) 34%, transparent) 0%, color-mix(in srgb, token(colors.field) 18%, transparent) 40%, transparent 66%)',
        })}
      />
    </div>
  )
}
