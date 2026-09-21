import { css } from '../../../styled-system/css'

const lines = ['JAMES −24', 'CASTILLO −23', 'SHIPLEY −23', 'POSTON −21']

export function GhostChase() {
  return (
    <div
      aria-hidden="true"
      className={css({
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { base: 'center', lg: 'flex-start' },
        paddingInline: '4vw',
        paddingTop: { base: '0', lg: '12vh' },
        overflow: 'hidden',
        pointerEvents: 'none',
      })}
    >
      {lines.map((line) => (
        <span
          key={line}
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: { base: 'lg', lg: 'hero' },
            lineHeight: 'tight',
            color: 'fieldInkMuted',
            opacity: 0.08,
            whiteSpace: 'nowrap',
            letterSpacing: 'tight',
          })}
        >
          {line}
        </span>
      ))}
    </div>
  )
}
