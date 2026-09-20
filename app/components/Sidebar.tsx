import { css } from '../../styled-system/css'

// The Type Treatment's "vertical" texture: a decorative locator line, rotated
// and set in vertical writing mode. Purely decorative, hidden from the a11y tree.
export function Sidebar() {
  return (
    <div
      aria-hidden="true"
      className={css({
        display: { base: 'none', md: 'flex' },
        position: 'absolute',
        top: 0,
        left: '10px',
        bottom: 0,
        alignItems: 'flex-end',
        paddingBottom: '9',
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        transformOrigin: 'center',
        fontFamily: 'display',
        fontSize: '2xs',
        letterSpacing: 'widest',
        textTransform: 'lowercase',
        color: 'fieldInkMuted',
        pointerEvents: 'none',
        zIndex: 2,
      })}
    >
      ashburn, virginia, est. 2016, spaceman llc
    </div>
  )
}
