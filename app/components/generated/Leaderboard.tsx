import { css } from '../../../styled-system/css'

const players = [
  { pos: 1, name: 'Neal Shipley', score: '−15' },
  { pos: 2, name: 'Ludvig Åberg', score: '−13' },
  { pos: 3, name: 'Scottie Scheffler', score: '−11' },
  { pos: 4, name: 'Collin Morikawa', score: '−9' },
  { pos: 5, name: 'Sam Burns', score: '−7' },
]

export function Leaderboard() {
  return (
    <div className={css({ minWidth: 0 })}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '3',
          mb: '1',
          flexWrap: 'wrap',
        })}
      >
        <span className={css({ fontFamily: 'display', fontWeight: 'bold', textStyle: 'lg' })}>
          Biltmore Championship
        </span>
        <span
          className={css({
            textStyle: '2xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'field',
            bg: 'accentAlt',
            px: '2',
            py: '1',
            borderRadius: 'sm',
            fontWeight: 'bold',
            flexShrink: 0,
          })}
        >
          In progress
        </span>
      </div>
      <p className={css({ textStyle: 'sm', color: 'fieldInkMuted', mb: '3' })}>
        Live evidence index, under par in pine.
      </p>
      <ul className={css({ listStyle: 'none', m: 0, p: 0, minWidth: 0 })}>
        {players.map((row) => (
          <li
            key={row.pos}
            className={css({
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              gap: '3',
              alignItems: 'baseline',
              py: '2',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
            })}
          >
            <span className={css({ textStyle: 'sm', color: 'fieldInkMuted' })}>{row.pos}</span>
            <span
              className={css({
                textStyle: 'base',
                color: 'fieldInk',
                minWidth: 0,
                overflowWrap: 'anywhere',
              })}
            >
              {row.name}
            </span>
            <span
              className={css({
                textStyle: 'base',
                fontWeight: 'bold',
                color: 'accentAlt',
                textAlign: 'right',
              })}
            >
              {row.score}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
