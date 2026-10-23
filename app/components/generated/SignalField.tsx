import { css } from '../../../styled-system/css'

const board = [
  { pos: '1', name: 'Blanchet', score: '−9', lead: true },
  { pos: 'T2', name: 'Kohles', score: '−8', lead: false },
  { pos: 'T2', name: 'Silverman', score: '−8', lead: false },
  { pos: 'T2', name: 'Walker', score: '−8', lead: false },
  { pos: 'T2', name: 'Conners', score: '−8', lead: false },
]

const markers = [
  { k: 'red wings', v: 'DET 5 · OPP 2 · ', win: 'W' },
  { k: 'weather', v: '47°F clear · Aldie VA', win: '' },
  { k: 'moon', v: 'waxing gibbous · 95%', win: '' },
]

// glow #CFE6D6 has no token; fieldInkMuted is the nearest fill.
const leadInk = css({
  '[data-lead] &': { color: 'accentAlt', fontWeight: 'bold', _dark: { color: 'field' } },
})

export function SignalField() {
  return (
    <aside
      aria-label="Today, on the wire"
      className={css({
        position: 'relative',
        zIndex: 1,
        marginTop: { base: '32px', lg: '-240px' },
        bg: 'bg',
        padding: '4',
        borderRadius: 'md',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <div
        className={css({
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
        })}
      >
        today · on the wire
      </div>
      <div
        className={css({
          marginTop: '18px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'accent',
          borderRadius: 'md',
          overflow: 'hidden',
          bg: 'bg',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '12px',
            paddingBlock: '12px',
            paddingInline: '14px',
            bg: 'fieldInkMuted',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accent',
            color: 'accentAlt',
            _dark: { color: 'field' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: '600',
              fontSize: '15px',
              letterSpacing: '-0.01em',
            })}
          >
            Butterfield Bermuda
          </span>
          <span className={css({ fontSize: '12px' })}>in progress</span>
        </div>
        {board.map((row) => (
          <div
            key={row.name}
            data-lead={row.lead ? 'true' : undefined}
            className={css({
              display: 'grid',
              gridTemplateColumns: '22px 1fr auto',
              alignItems: 'baseline',
              gap: '12px',
              paddingBlock: '9px',
              paddingInline: '14px',
              fontSize: '14px',
              bg: 'bg',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              _last: { borderBottomWidth: '0' },
              '&[data-lead]': { bg: 'fieldInkMuted' },
            })}
          >
            <span
              className={`${css({ fontSize: '12px', color: 'textMuted', fontVariantNumeric: 'tabular-nums' })} ${leadInk}`}
            >
              {row.pos}
            </span>
            <span className={`${css({ color: 'text' })} ${leadInk}`}>{row.name}</span>
            <span
              className={`${css({ color: 'accent', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' })} ${leadInk}`}
            >
              {row.score}
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          marginTop: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        })}
      >
        {markers.map((m) => (
          <div
            key={m.k}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              paddingTop: '12px',
            })}
          >
            <div
              className={css({
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'textMuted',
                marginBottom: '5px',
              })}
            >
              {m.k}
            </div>
            <div
              className={css({
                fontSize: '15px',
                fontVariantNumeric: 'tabular-nums',
                color: 'text',
              })}
            >
              {m.v}
              <span className={css({ color: 'accent', fontWeight: 'bold' })}>{m.win}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
