import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type MetaProject = { role?: string; stack?: string[]; liveUrl?: string }

const kCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '1',
})

const vCss = css({ fontSize: 'base', color: 'text' })

const pillCss = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accent',
  border: '1px solid',
  borderColor: 'accent',
  borderRadius: 'md',
  padding: '3 5',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'accentAlt', borderColor: 'accentAlt' },
})

export function CaseStudyMeta({ project }: { project: MetaProject }) {
  return (
    <Flex
      as="section"
      wrap="wrap"
      gap="8"
      align="baseline"
      padding={{ base: '24px 20px 32px', md: '0 7vw 64px' }}
      borderTop="1px solid"
      borderColor="border"
      paddingTop="6"
    >
      {project.role && (
        <Box>
          <Box className={kCss}>Role</Box>
          <Box className={vCss}>{project.role}</Box>
        </Box>
      )}
      {project.stack && (
        <Box>
          <Box className={kCss}>Stack</Box>
          <Box className={vCss}>{project.stack.join(' · ')}</Box>
        </Box>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} className={pillCss}>
          Visit live &rarr;
        </a>
      )}
    </Flex>
  )
}
