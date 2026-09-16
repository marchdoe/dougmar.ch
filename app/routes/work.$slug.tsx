import { createFileRoute } from '@tanstack/react-router'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { WorkDetailHero } from '../components/generated/WorkDetailHero'
import { CaseStudyBlocks } from '../components/generated/CaseStudyBlocks'
import { StackAndLink } from '../components/generated/StackAndLink'
import { ContextBlock } from '../components/generated/ContextBlock'
import { ProcessSteps } from '../components/generated/ProcessSteps'
import { DecisionsList } from '../components/generated/DecisionsList'
import { ReferencesList } from '../components/generated/ReferencesList'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

const allProjects = [featuredProject, ...selectedWork, ...experiments].filter(
  Boolean
) as typeof selectedWork

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = allProjects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <Box px={{ base: '4', md: '6', lg: '96px' }} py="14">
        <h1
          className={css({
            textStyle: '3xl',
            fontFamily: 'display',
            color: 'text',
            textTransform: 'lowercase',
          })}
        >
          project not found
        </h1>
      </Box>
    )
  }

  return (
    <>
      <WorkDetailHero
        title={project.title}
        type={project.type}
        year={project.year}
        role={project.role}
        liveUrl={project.liveUrl ?? project.externalUrl}
      />
      <Box as="main" pt={{ base: '9', md: '12' }} pb={{ base: '10', md: '14' }}>
        <CaseStudyBlocks
          blocks={[
            { label: 'problem', body: project.problem },
            { label: 'approach', body: project.approach },
            { label: 'outcome', body: project.outcome },
          ]}
        />
        <StackAndLink stack={project.stack} liveUrl={project.liveUrl} />
        {(project.context || project.constraints) && (
          <ContextBlock context={project.context} constraints={project.constraints} />
        )}
        {project.process && <ProcessSteps steps={project.process} />}
        {project.decisions && <DecisionsList decisions={project.decisions} />}
        {project.references && <ReferencesList references={project.references} />}
      </Box>
    </>
  )
}
