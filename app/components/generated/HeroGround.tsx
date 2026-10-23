import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function HeroGround() {
  return (
    <div
      aria-hidden="true"
      data-allow-x-overflow
      className={css({
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      })}
    >
      <div
        data-allow-x-overflow
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        {/* The mesh is softened so the type above it keeps its contrast on the bg fill. */}
        <div className={css({ position: 'absolute', inset: '0', opacity: 0.45 })}>
          <Ground material="mesh" seed={725980547} />
        </div>
      </div>
    </div>
  )
}
