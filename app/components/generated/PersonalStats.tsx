import { css } from '../../../styled-system/css'

type Props = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function PersonalStats({ holesInOne, sport, teams, currentFocus }: Props) {
  const rows = [
    { label: 'Holes in one', value: String(holesInOne) },
    { label: 'Sport', value: sport },
    { label: 'Teams', value: teams.join(', ') },
    { label: 'Current focus', value: currentFocus },
  ]
  return (
    <ul
      className={css({
        listStyle: 'none',
        m: 0,
        p: 0,
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      {rows.map((r) => (
        <li
          key={r.label}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            gap: '4',
            py: '2',
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
          })}
        >
          <span
            className={css({
              textStyle: 'sm',
              color: 'fieldInkMuted',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
            })}
          >
            {r.label}
          </span>
          <span
            className={css({
              textStyle: 'sm',
              color: 'fieldInk',
              fontWeight: 'bold',
              textAlign: 'right',
            })}
          >
            {r.value}
          </span>
        </li>
      ))}
    </ul>
  )
}
