import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { CaseStudyHero } from '../components/generated/CaseStudyHero'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { CaseStudyStack } from '../components/generated/CaseStudyStack'
import { CaseStudyContext } from '../components/generated/CaseStudyContext'
import { CaseStudyProcess } from '../components/generated/CaseStudyProcess'
import { CaseStudyDecisions } from '../components/generated/CaseStudyDecisions'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <Box className={css({ paddingInline: { base: '5', lg: '8' }, paddingBlock: '9' })}>
        <p className={css({ fontFamily: 'display', textStyle: 'lg', color: 'text' })}>
          Project not found.
        </p>
      </Box>
    )
  }

  const extended = project as typeof project & { timeline?: string; status?: string }

  return (
    <>
      <CaseStudyHero project={extended} />
      <CaseStudyNarrative project={project} />
      <CaseStudyStack project={project} />
      <CaseStudyContext project={project} />
      <CaseStudyProcess project={project} />
      <CaseStudyDecisions project={project} />
    </>
  )
}
