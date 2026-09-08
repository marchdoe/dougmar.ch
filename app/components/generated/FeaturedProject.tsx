import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

export function FeaturedProject({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: '1.15fr 0.85fr' }}
      gap={{ base: '18px', md: '30px' }}
      bg="surface"
      border="1px solid"
      borderColor="borderStrong"
      borderLeft="4px solid"
      borderLeftColor="accent"
      borderRadius="md"
      p={{ base: '26px', md: '44px' }}
      mb={{ base: '30px', md: '48px' }}
      alignItems="start"
    >
      <Box
        as="h3"
        fontFamily="display"
        fontWeight="900"
        fontSize={{ base: '32px', md: '64px' }}
        lineHeight="0.98"
        letterSpacing="tight"
        overflowWrap="break-word"
        wordBreak="break-word"
      >
        {project.title}
      </Box>
      <Box display="flex" gap="18px" flexWrap="wrap">
        <Box
          as="span"
          textStyle="sm"
          textTransform="uppercase"
          letterSpacing="wide"
          color="accentAlt"
        >
          {project.type}
        </Box>
        <Box as="span" textStyle="sm" color="textFaint" fontVariantNumeric="tabular-nums">
          {project.year}
        </Box>
        <Box
          as="span"
          textStyle="2xs"
          textTransform="uppercase"
          letterSpacing="wide"
          color="textFaint"
        >
          Featured
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        gridColumn={{ lg: '2' }}
        gridRow={{ lg: '1 / span 2' }}
      >
        <Box as="p" color="textMuted" textStyle="lg" lineHeight="normal" maxW="56ch">
          {project.problem}
        </Box>
        <a
          href={href}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            alignSelf: 'flex-start',
            bg: 'accent',
            color: 'accentText',
            fontWeight: '700',
            textStyle: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            px: '22px',
            py: '14px',
            borderRadius: 'md',
            minHeight: '44px',
            _hover: { bg: 'accentAlt', color: 'accentText' },
          })}
        >
          Visit {project.title} →
        </a>
      </Box>
    </Box>
  )
}
