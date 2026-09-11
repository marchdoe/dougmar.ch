import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutHero() {
  return (
    <Box
      as="section"
      aria-label="About"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          textStyle: 'sm',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        {identity.name} · {identity.role}
      </div>
      {/* Long-form statement runs on the body step, not a display heading step —
          a 340-character sentence at display scale is a wall, not a hero. */}
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'lg',
          color: 'text',
          maxWidth: '60ch',
        })}
      >
        {identity.statement}
      </p>
    </Box>
  )
}
