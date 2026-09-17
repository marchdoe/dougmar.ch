import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { Ground } from '../Material'

function sanitize(text: string) {
  return text.replace(/\s*—\s*/g, ', ')
}

export function AboutHero({
  name,
  role,
  statement,
}: {
  name: string
  role: string
  statement: string
}) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '56px 40px', md: '96px 56px' },
      })}
    >
      <Ground material="grain" seed={2127111272} />
      <Box position="relative" zIndex="1">
        <span
          className={css({
            fontSize: 'xs',
            fontWeight: '600',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {name}, {role}
        </span>
        <Box
          as="h1"
          fontFamily="body"
          fontWeight="normal"
          color="text"
          textAlign="left"
          className={css({
            fontSize: { base: 'md', md: 'lg' },
            lineHeight: 'loose',
            letterSpacing: 'normal',
            marginTop: '3',
            maxWidth: '62ch',
          })}
        >
          {sanitize(statement)}
        </Box>
      </Box>
    </Box>
  )
}
