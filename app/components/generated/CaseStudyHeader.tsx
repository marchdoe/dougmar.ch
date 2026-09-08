import { Box } from '../../../styled-system/jsx'
import type { Project } from '../../content/projects'

export function CaseStudyHeader({ project }: { project: Project }) {
  const standfirst = project.description ?? project.problem
  return (
    <Box
      as="header"
      bg="bgAlt"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '40px', md: '64px' }}
      display="flex"
      flexDirection="column"
      gap="16px"
    >
      <Box display="flex" gap="18px" flexWrap="wrap" alignItems="baseline">
        <Box
          as="span"
          textStyle="sm"
          textTransform="uppercase"
          letterSpacing="wide"
          color="accentAlt"
          fontWeight="700"
        >
          {project.type}
        </Box>
        <Box as="span" textStyle="sm" color="textFaint" fontVariantNumeric="tabular-nums">
          {project.year}
        </Box>
        {project.role ? (
          <Box
            as="span"
            textStyle="sm"
            color="textMuted"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            {project.role}
          </Box>
        ) : null}
      </Box>
      <Box
        as="h1"
        fontFamily="display"
        fontWeight="900"
        fontSize={{ base: '32px', md: '40px', lg: '56px', xl: '72px' }}
        lineHeight="tight"
        letterSpacing="tight"
        overflowWrap="break-word"
        wordBreak="break-word"
      >
        {project.title}
      </Box>
      {standfirst ? (
        <Box as="p" textStyle="lg" color="textMuted" maxW="56ch" lineHeight="normal">
          {standfirst}
        </Box>
      ) : null}
    </Box>
  )
}
