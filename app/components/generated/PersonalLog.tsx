import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const rowClass = css({
  display: 'flex',
  gap: '3',
  padding: '1 0',
  borderBottom: '1px solid',
  borderColor: 'border',
  flexWrap: 'wrap',
})
const kClass = css({ color: 'accentAlt', fontWeight: 'bold', minWidth: '110px' })

export function PersonalLog() {
  return (
    <Box
      as="section"
      aria-label="Personal"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          borderBottom: '1px solid',
          borderColor: 'border',
          paddingBottom: '3',
          marginBottom: '4',
        })}
      >
        off the record
      </div>
      <Box
        className={css({
          fontFamily: 'display',
          textStyle: 'sm',
          color: 'textMuted',
          display: 'grid',
          gap: '0px',
        })}
      >
        <div className={rowClass}>
          <span className={kClass}>golf</span> <b>{personal.holesInOne}</b> hole
          {personal.holesInOne === 1 ? '' : 's'}-in-one
        </div>
        <div className={rowClass}>
          <span className={kClass}>sport</span> {personal.sport}
        </div>
        <div className={rowClass}>
          <span className={kClass}>teams</span> {personal.teams.join(' · ')}
        </div>
        <div className={rowClass}>
          <span className={kClass}>now</span> {personal.currentFocus}
        </div>
      </Box>
    </Box>
  )
}
