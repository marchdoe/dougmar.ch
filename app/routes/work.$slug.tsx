import { createFileRoute } from '@tanstack/react-router'
import { projects } from '../content/projects'
import { CaseStudyHeader } from '../components/generated/CaseStudyHeader'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { WhitePaperSections } from '../components/generated/WhitePaperSections'
import { Colophon } from '../components/generated/Colophon'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <Box as="main" paddingInline={{ base: '20px', md: '6', lg: '8' }} paddingBlock="9">
        <Box className={css({ textStyle: 'lg', color: 'textMuted' })}>Project not found.</Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        as="main"
        paddingInline={{ base: '20px', md: '6', lg: '8' }}
        paddingBlock={{ base: '9', md: '9' }}
        display="flex"
        flexDirection="column"
        gap="6"
      >
        <CaseStudyHeader project={project} />
        <CaseStudyNarrative project={project} />
        <WhitePaperSections project={project} />
      </Box>
      <Colophon
        signals={[
          { label: 'Project', value: project.title },
          { label: 'Year', value: String(project.year) },
        ]}
      />
    </>
  )
}
