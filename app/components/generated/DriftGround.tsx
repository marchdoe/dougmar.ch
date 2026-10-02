import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

export function DriftGround() {
  return (
    <div
      aria-hidden="true"
      className={css({
        position: 'absolute',
        inset: '-4%',
        zIndex: 0,
        bg: 'bg',
        pointerEvents: 'none',
        animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
      })}
    >
      <Ground material="mesh" seed={1010854297} />
    </div>
  )
}
