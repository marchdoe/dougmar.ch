import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { WorkHeader } from '../components/generated/WorkHeader'
import { WorkNarrative } from '../components/generated/WorkNarrative'
import { WorkMeta } from '../components/generated/WorkMeta'
import { WhitePaper } from '../components/generated/WhitePaper'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <Box
        as="section"
        bg="bg"
        color="text"
        className={css({ padding: '9', paddingInline: '7vw' })}
      >
        <h1>Project not found.</h1>
      </Box>
    )
  }

  return (
    <>
      <WorkHeader project={project} />
      <WorkNarrative project={project} />
      <WorkMeta project={project} />
      <WhitePaper project={project} />
    </>
  )
}
