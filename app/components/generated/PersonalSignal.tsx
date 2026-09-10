import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

const rowStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '2',
  paddingY: '2',
  borderBottom: '1px solid',
  borderColor: 'border',
})

export function PersonalSignal({ personal }: { personal: Personal }) {
  return (
    <Box
      className={css({
        marginTop: '9',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        paddingTop: '6',
      })}
    >
      <p
        className={css({
          textStyle: '2xs',
          fontWeight: '700',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        Off the clock
      </p>
      <Box className={rowStyle}>
        <span className={css({ textStyle: '2xs', fontVariant: 'small-caps', color: 'textMuted' })}>
          Holes in one
        </span>
        <span className={css({ textStyle: 'sm', color: 'text' })}>{personal.holesInOne}</span>
      </Box>
      <Box className={rowStyle}>
        <span className={css({ textStyle: '2xs', fontVariant: 'small-caps', color: 'textMuted' })}>
          Sport
        </span>
        <span className={css({ textStyle: 'sm', color: 'text' })}>{personal.sport}</span>
      </Box>
      <Box className={rowStyle}>
        <span className={css({ textStyle: '2xs', fontVariant: 'small-caps', color: 'textMuted' })}>
          Teams
        </span>
        <span className={css({ textStyle: 'sm', color: 'text' })}>
          {personal.teams.join(' · ')}
        </span>
      </Box>
      <p className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '4', maxWidth: '60ch' })}>
        {personal.currentFocus}
      </p>
    </Box>
  )
}
