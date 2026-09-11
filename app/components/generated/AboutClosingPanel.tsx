import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function AboutClosingPanel() {
  return (
    <Box
      as="section"
      aria-label="The turn, again"
      bg="field"
      color="fieldInk"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '9', lg: '9' },
        minHeight: { base: '30vh' },
        display: 'flex',
        alignItems: 'center',
        borderBottom: '2px solid',
        borderColor: 'fieldBorder',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          letterSpacing: 'tight',
          color: 'fieldInk',
        })}
      >
        Also not free to{' '}
        <span
          className={css({
            bg: 'accent',
            color: 'accentText',
            paddingInline: '1',
            display: 'inline-block',
          })}
        >
          own
        </span>
        .
      </h2>
    </Box>
  )
}
