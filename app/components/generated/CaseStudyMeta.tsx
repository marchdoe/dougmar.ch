import { Box, Wrap } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

export function CaseStudyMeta({ project }: { project: Project }) {
  return (
    <Box
      bg="field"
      color="fieldInk"
      borderTop={{ base: '1px solid', lg: 'none' }}
      borderLeft={{ lg: '1px solid' }}
      borderColor="fieldBorder"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      display="flex"
      flexDirection="column"
      gap="24px"
    >
      <Box fontFamily="display" fontWeight="900" textStyle="lg" color="accent">
        {project.year}
      </Box>

      {project.stack ? (
        <Wrap gap="10px">
          {project.stack.map((s) => (
            <Box
              key={s}
              as="span"
              textStyle="sm"
              textTransform="uppercase"
              letterSpacing="wide"
              color="fieldInkMuted"
              border="1px solid"
              borderColor="fieldBorder"
              borderRadius="md"
              px="12px"
              py="6px"
            >
              {s}
            </Box>
          ))}
        </Wrap>
      ) : null}

      {project.liveUrl ? (
        <a
          href={project.liveUrl}
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
          Visit live →
        </a>
      ) : null}
    </Box>
  )
}
