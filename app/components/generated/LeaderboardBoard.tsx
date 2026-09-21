import { css } from '../../../styled-system/css'

type Row = { pos: string; name: string; note: string; score: string; win?: boolean }

const rows: Row[] = [
  { pos: '1', name: 'Jacob Bridgeman', note: 'Winner, led wire to wire', score: '−26', win: true },
  { pos: '2', name: 'Ben James', note: 'Solo second, two back', score: '−24' },
  { pos: 'T3', name: 'Ricky Castillo', note: 'Tied third', score: '−23' },
  { pos: 'T3', name: 'Adam Shipley', note: 'Tied third', score: '−23' },
  { pos: '5', name: 'J.T. Poston', note: 'Fifth', score: '−21' },
]

const rowBase = css({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  alignItems: 'baseline',
  columnGap: '4',
  rowGap: '1',
  borderBottom: '1px solid',
  borderColor: 'fieldBorder',
  paddingBlock: '4',
})
const rowFirst = css({ paddingBlock: '5' })
const posMuted = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'wide',
  color: 'fieldInkMuted',
  minWidth: '5ch',
})
const posWin = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'wide',
  color: 'accentAlt',
  minWidth: '5ch',
})
const whoMuted = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: 'base', lg: '2xl' },
  lineHeight: 'tight',
  color: 'fieldInk',
  minWidth: '0',
  overflowWrap: 'break-word',
})
const whoWin = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: 'base', lg: '2xl' },
  lineHeight: 'tight',
  color: 'accentAlt',
  minWidth: '0',
  overflowWrap: 'break-word',
})
const noteClass = css({
  display: 'block',
  fontFamily: 'body',
  fontWeight: 'medium',
  fontSize: 'xs',
  color: 'fieldInkMuted',
  marginTop: '1',
})
const scoreMuted = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: { base: 'base', lg: '3xl' },
  color: 'accent',
})
const scoreWin = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: { base: 'lg', lg: '4xl' },
  color: 'accentAlt',
})

export function LeaderboardBoard() {
  return (
    <div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          columnGap: '5',
          rowGap: '2',
          borderBottom: '1px solid',
          borderColor: 'borderStrong',
          paddingBottom: '3',
          marginBottom: '1',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: { base: 'lg', lg: 'xl' },
            color: 'fieldInk',
          })}
        >
          Final, the Biltmore Championship
        </h2>
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'medium',
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontVariant: 'small-caps',
            color: 'fieldInkMuted',
          })}
        >
          Monday finish, to par
        </span>
      </div>
      {rows.map((row, index) => (
        <div key={row.pos + row.name} className={`${rowBase} ${index === 0 ? rowFirst : ''}`}>
          <span className={row.win ? posWin : posMuted}>{row.pos}</span>
          <span className={row.win ? whoWin : whoMuted}>
            {row.name}
            <small className={noteClass}>{row.note}</small>
          </span>
          <span className={row.win ? scoreWin : scoreMuted}>{row.score}</span>
        </div>
      ))}
    </div>
  )
}
