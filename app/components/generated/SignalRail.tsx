import { css } from '../../../styled-system/css'

const board = [
  { pos: '1', name: 'Zach Bauchou', score: '−9', lead: true },
  { pos: 'T2', name: 'Yellamaraju', score: '−8', lead: false },
  { pos: 'T2', name: 'Lipsky', score: '−8', lead: false },
  { pos: 'T2', name: 'Jaeger', score: '−8', lead: false },
  { pos: 'T2', name: 'Fisk', score: '−8', lead: false },
]

const head = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontStyle: 'italic',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  fontSize: 'clamp(18px, 1.5vw, 22px)',
  color: 'fieldInk',
  marginBottom: '14px',
})

const rowBase = css({
  display: 'grid',
  gridTemplateColumns: '1.6rem 1fr auto',
  alignItems: 'baseline',
  columnGap: '12px',
  paddingBlock: '11px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  fontSize: '15px',
  fontVariantNumeric: 'tabular-nums',
  color: 'fieldInk',
  _last: { borderBottomWidth: '0' },
})
const rowLead = css({ color: 'accent', fontWeight: 'bold' })
const rowPlain = css({ color: 'fieldInk' })
const pos = css({ fontSize: '12px' })
const meta = css({ fontSize: '14px', color: 'fieldInkMuted', lineHeight: '1.55' })

export function SignalRail() {
  return (
    <aside
      aria-label="Today's signals"
      className={css({
        position: 'relative',
        zIndex: 1,
        bg: 'field',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderTopWidth: { base: '1px', lg: '0' },
        borderLeftWidth: { base: '0', lg: '1px' },
        borderRightWidth: '0',
        borderBottomWidth: '0',
        paddingBlock: 'clamp(28px, 5vw, 44px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { base: 'flex-start', lg: 'center' },
        rowGap: { base: '30px', lg: '34px' },
        fontFamily: 'body',
      })}
    >
      <div>
        <h2 className={head}>Bank of Utah</h2>
        <div
          className={css({
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '13px',
            color: 'fieldInkMuted',
            marginBottom: '4',
          })}
        >
          In progress · Championship
        </div>
        {board.map((row) => (
          <div key={row.name} className={`${rowBase} ${row.lead ? rowLead : rowPlain}`}>
            <span className={pos}>{row.pos}</span>
            <span>{row.name}</span>
            <span>{row.score}</span>
          </div>
        ))}
      </div>
      <div>
        <h2 className={head}>Market</h2>
        <div
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            columnGap: '12px',
            flexWrap: 'wrap',
            fontVariantNumeric: 'tabular-nums',
            color: 'fieldInk',
            fontSize: '17px',
          })}
        >
          <span className={css({ fontFamily: 'display', fontWeight: 'bold' })}>SPY</span>
          <span>763.99</span>
          <span className={css({ color: 'accent', fontSize: '15px', fontWeight: 'bold' })}>
            ▲ 0.18%
          </span>
        </div>
      </div>
      <div>
        <h2 className={head}>Aldie, VA</h2>
        <p className={meta}>
          <span className={css({ color: 'fieldInk', fontWeight: 'bold' })}>66.7°F</span> · Cloudy ·
          Air quality Good (AQI 1)
        </p>
        <p className={meta}>Moon at last quarter, 58.5% lit</p>
      </div>
    </aside>
  )
}
