import { Box } from '../../../styled-system/jsx'
import { FeaturedProject } from './FeaturedProject'
import { ProjectColumn } from './ProjectColumn'
import type { Project } from '../../content/projects'

export function WorkIndexSection({
  featured,
  selected,
  experiments,
}: {
  featured?: Project
  selected: Project[]
  experiments: Project[]
}) {
  return (
    <Box
      as="section"
      position="relative"
      bg="bgAlt"
      borderTop="1px solid"
      borderColor="borderStrong"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '48px', md: '90px' }}
      pb={{ base: '40px', md: '60px' }}
    >
      <Box
        display="flex"
        alignItems="baseline"
        justifyContent="space-between"
        flexWrap="wrap"
        gap="16px"
        mb={{ base: '28px', md: '44px' }}
      >
        <Box as="h2" fontFamily="display" fontWeight="700" textStyle="2xl" letterSpacing="tight">
          What survived the rebuild
        </Box>
        <Box
          as="span"
          textStyle="2xs"
          textTransform="uppercase"
          letterSpacing="wide"
          color="textFaint"
        >
          Index · 2008 &ndash; 2026
        </Box>
      </Box>

      {featured ? <FeaturedProject project={featured} /> : null}

      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '1.2fr 1fr' }}
        gap={{ base: '34px', md: '56px' }}
      >
        <ProjectColumn heading="Selected work" items={selected} />
        <ProjectColumn heading="Experiments" items={experiments} />
      </Box>
    </Box>
  )
}
