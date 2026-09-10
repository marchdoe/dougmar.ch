import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

const rows = [
  { label: 'DET · MLB · W', value: '7–2', marked: true },
  { label: 'Moon · New', value: '0.6% lit', marked: false },
  { label: 'SPY', value: '762.40 ▾0.46%', marked: false },
  { label: 'Sky · Clear', value: '72.7°F', marked: false },
  { label: 'Daylight', value: '12.5h', marked: false },
]

export function SignalLedger() {
  return (
    <Box
      as="footer"
      className={css({
        gridArea: 'ledger',
        bg: 'field',
        color: 'fieldInk',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
        borderRight: { lg: '1px solid' },
        paddingX: { base: '5', lg: '6' },
        paddingTop: { base: '5', lg: '6' },
        paddingBottom: { base: '6', lg: '6' },
        minWidth: 0,
        maxWidth: '100%',
        overflowX: 'hidden',
      })}
    >
      <Box
        className={css({
          textStyle: '2xs',
          fontWeight: '700',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'fieldInkMuted',
          marginBottom: '4',
        })}
      >
        Today in the field — Sept 10, 2026
      </Box>

      {rows.map((row) => (
        <Box
          key={row.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '3',
            alignItems: 'baseline',
            paddingY: '2',
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
            minWidth: 0,
          })}
        >
          <span
            className={css({
              textStyle: '2xs',
              fontWeight: '600',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: row.marked ? 'fieldInk' : 'fieldInkMuted',
            })}
          >
            {row.label}
          </span>
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: row.marked ? '700' : '500',
              color: row.marked ? 'accent' : 'fieldInk',
              textAlign: 'right',
            })}
          >
            {row.value}
          </span>
        </Box>
      ))}

      <Box className={css({ marginTop: '4' })}>
        <span
          className={css({
            textStyle: '2xs',
            fontWeight: '600',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
            display: 'block',
            marginBottom: '1',
          })}
        >
          On rotation
        </span>
        <p
          className={css({
            textStyle: 'xs',
            lineHeight: 'normal',
            color: 'fieldInkMuted',
            maxWidth: '42ch',
          })}
        >
          My Morning Jacket · Tobin Sprout · Radiohead
        </p>
      </Box>

      <Box className={css({ marginTop: '4', display: 'flex', flexDirection: 'column', gap: '2' })}>
        <span className={css({ textStyle: '2xs', color: 'fieldInkMuted' })}>
          <b className={css({ fontWeight: '600' })}>Awwwards</b> — Qissa, site of the day
        </span>
        <span className={css({ textStyle: '2xs', color: 'fieldInkMuted' })}>
          <b className={css({ fontWeight: '600' })}>HN</b> — the iPhone Duo, front page
        </span>
      </Box>
    </Box>
  )
}
