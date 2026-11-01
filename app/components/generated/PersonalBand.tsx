import { css } from '../../../styled-system/css'

type Props = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function PersonalBand({ holesInOne, sport, teams, currentFocus }: Props) {
  const rows = [
    { label: 'Holes in one', value: String(holesInOne) },
    { label: 'Sport', value: sport },
    { label: 'Teams', value: teams.join(', ') },
    { label: 'Current focus', value: currentFocus },
  ]
  return (
    <section
      aria-label="Off hours"
      className={css({
        bg: 'bgAlt',
        paddingBlock: { base: '6', lg: '7' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        display: 'grid',
        gap: '5',
        gridTemplateColumns: {
          base: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(4, minmax(0, 1fr))',
        },
        borderBottom: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      {rows.map((r) => (
        <div key={r.label} className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          <span
            className={css({
              fontSize: '2xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {r.label}
          </span>
          <span className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '45ch' })}>
            {r.value}
          </span>
        </div>
      ))}
    </section>
  )
}
