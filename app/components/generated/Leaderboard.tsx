import { css } from '../../../styled-system/css'

const board = [
  { pos: '1', name: 'Blades Brown', score: '−25' },
  { pos: '2', name: 'Ben James', score: '−24' },
  { pos: '3', name: 'Si Woo Kim', score: '−22' },
  { pos: '4', name: 'Rikuya Hirata', score: '−21' },
  { pos: '5', name: 'Harry Ford', score: '−20' },
]

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: '1.6rem 1fr auto',
  alignItems: 'baseline',
  gap: '12px',
  paddingBlock: '11px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
  _last: { borderBottomWidth: '0' },
})
const leadRowClass = css({
  display: 'grid',
  gridTemplateColumns: '1.6rem 1fr auto',
  alignItems: 'baseline',
  gap: '12px',
  paddingBlock: '11px',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})
// textFaint measured 4.08:1 on surface in dark; textMuted clears 4.5:1 in both schemes
const posClass = css({
  fontSize: '2xs',
  color: 'textMuted',
  fontWeight: 'bold',
  fontVariantNumeric: 'tabular-nums',
})
const nameClass = css({ fontSize: 'base', fontWeight: 'normal', color: 'text' })
const leadNameClass = css({
  fontSize: 'clamp(20px, 2.4vw, 26px)',
  fontWeight: 'bold',
  fontFamily: 'display',
  color: 'text',
  lineHeight: '1.1',
})
const scoreClass = css({
  fontSize: 'base',
  fontWeight: 'bold',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
  letterSpacing: '0.01em',
})
const leadScoreClass = css({
  fontSize: 'clamp(20px, 2.4vw, 26px)',
  fontWeight: 'bold',
  color: 'accentAlt',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
})

export function Leaderboard() {
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(14px, 2vw, 20px)',
        gridColumn: { lg: '8 / 13' },
        gridRow: { lg: '1' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          fontSize: '2xs',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'accentAlt',
          fontWeight: 'bold',
          paddingBottom: '10px',
        })}
      >
        <span>Final leaderboard · top 5</span>
        <span className={css({ color: 'textMuted' })}>to par</span>
      </div>
      {board.map((r, i) => (
        <div key={r.pos} className={i === 0 ? leadRowClass : rowClass}>
          <span className={posClass}>{r.pos}</span>
          <span className={i === 0 ? leadNameClass : nameClass}>{r.name}</span>
          <span className={i === 0 ? leadScoreClass : scoreClass}>{r.score}</span>
        </div>
      ))}
    </div>
  )
}
