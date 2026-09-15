import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { projects } from '../content/projects'
import { WorkHero } from '../components/generated/WorkHero'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { WhitePaperBlock } from '../components/generated/WhitePaperBlock'
import { PrevNextNav } from '../components/generated/PrevNextNav'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = index >= 0 ? projects[index] : projects[0]
  const prev = index > 0 ? projects[index - 1] : undefined
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined

  return (
    <Box
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1.7fr) minmax(320px,0.9fr)' },
      })}
    >
      <WorkHero project={project} />
      <Box
        as="aside"
        bg="field"
        color="fieldInk"
        minWidth="0px"
        className={css({
          position: 'relative',
          padding: { base: '32px 6vw 44px', lg: '40px 3vw 56px', xl: '52px 40px 64px' },
        })}
      >
        <CaseStudyNarrative project={project} />
        <WhitePaperBlock project={project} />
        <PrevNextNav prev={prev} next={next} />
      </Box>
    </Box>
  )
}
