import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '1fr auto' },
  gap: { base: '6px', md: '12px 20px' },
  alignItems: 'baseline',
  py: { base: '15px', md: '19px' },
  borderBottom: '1px solid',
  borderColor: 'border',
  '&:hover span:first-child': { color: 'accent' },
})

export function ProjectColumn({ heading, items }: { heading: string; items: Project[] }) {
  return (
    <Box minW="0">
      <Box
        as="h3"
        textStyle="sm"
        textTransform="uppercase"
        letterSpacing="wide"
        color="accentAlt"
        fontWeight="700"
        pb="12px"
        mb="4px"
        borderBottom="1px solid"
        borderColor="borderStrong"
      >
        {heading}
      </Box>
      {items.map((project) => {
        const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
        return (
          <a key={project.slug} href={href} className={rowClass}>
            <Box
              as="span"
              fontFamily="display"
              fontWeight="700"
              textStyle="lg"
              letterSpacing="tight"
              color="text"
              minW="0"
              overflowWrap="break-word"
            >
              {project.title}
            </Box>
            <Box display="flex" gap="14px" alignItems="baseline" flexWrap="wrap">
              <Box
                as="span"
                textStyle="sm"
                color="textMuted"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {project.type}
              </Box>
              <Box as="span" textStyle="sm" color="textFaint" fontVariantNumeric="tabular-nums">
                {project.year}
              </Box>
            </Box>
          </a>
        )
      })}
    </Box>
  )
}
