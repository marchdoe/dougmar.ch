import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { CaseStudyHeader } from '../components/generated/CaseStudyHeader'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { CaseStudyMeta } from '../components/generated/CaseStudyMeta'
import { WhitePaperSection } from '../components/generated/WhitePaperSection'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <Box bg="bg" color="text" px={{ base: '28px', md: '88px' }} py="88px" textStyle="xl">
        Project not found.
      </Box>
    )
  }

  return (
    <>
      <CaseStudyHeader project={project} />
      <Box
        display={{ base: 'flex', lg: 'grid' }}
        flexDirection="column"
        gridTemplateColumns={{ lg: '1fr 1fr' }}
      >
        <CaseStudyNarrative project={project} />
        <CaseStudyMeta project={project} />
      </Box>
      <WhitePaperSection paper={project} />
    </>
  )
}
