import { css } from '../../../styled-system/css'
import { Box, Flex } from '../../../styled-system/jsx'
import type { Project } from '../../content/projects'

export function PrevNextNav({ prev, next }: { prev?: Project; next?: Project }) {
  if (!prev && !next) return null
  return (
    <Flex
      as="nav"
      aria-label="More work"
      justify="space-between"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({
        pt: '5',
        mt: '2',
        fontSize: 'sm',
        textTransform: 'uppercase',
        letterSpacing: 'wide',
      })}
    >
      <Box>
        {prev && (
          <a href={`/work/${prev.slug}`} className={css({ color: 'accentAlt' })}>
            &larr; {prev.title}
          </a>
        )}
      </Box>
      <Box>
        {next && (
          <a href={`/work/${next.slug}`} className={css({ color: 'accentAlt' })}>
            {next.title} &rarr;
          </a>
        )}
      </Box>
    </Flex>
  )
}
