import { css } from '../../../styled-system/css'
import { Box, Flex } from '../../../styled-system/jsx'
import { personal } from '../../content/about'

const rows = [
  { label: 'holes in one', value: String(personal.holesInOne) },
  { label: 'sport', value: personal.sport },
  { label: 'teams', value: personal.teams.join(' · ') },
  { label: 'current focus', value: personal.currentFocus },
]

export function PersonalLedger() {
  return (
    <Box className={css({ borderTop: '1px solid', borderColor: 'border', marginTop: '9' })}>
      {rows.map((r) => (
        <Flex
          key={r.label}
          justify="space-between"
          align="baseline"
          gap="4"
          className={css({ paddingBlock: '4', borderBottom: '1px solid', borderColor: 'border' })}
        >
          <span
            className={css({
              textStyle: 'xs',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              fontVariant: 'small-caps',
            })}
          >
            {r.label}
          </span>
          <span
            className={css({
              textStyle: 'sm',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {r.value}
          </span>
        </Flex>
      ))}
    </Box>
  )
}
