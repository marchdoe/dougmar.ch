import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function PersonalSignals({ personal }: { personal: Personal }) {
  const rows = [
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Current focus', v: personal.currentFocus },
  ]
  return (
    <Box as="section" borderTop="1px solid" borderColor="fieldBorder" className={css({ pt: '5' })}>
      <Box
        className={css({
          color: 'fieldInkMuted',
          mb: '4',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
        })}
      >
        Off the clock
      </Box>
      <Box as="ul" className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        {rows.map((r) => (
          <Box
            as="li"
            key={r.k}
            borderTop="1px dotted"
            borderColor="fieldBorder"
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              gap: '3',
              py: '2',
              fontSize: 'base',
              _first: { borderTop: 'none' },
            })}
          >
            <span
              className={css({
                color: 'fieldInkMuted',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
                fontSize: '2xs',
              })}
            >
              {r.k}
            </span>
            <span className={css({ color: 'fieldInk', textAlign: 'right' })}>{r.v}</span>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
