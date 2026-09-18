import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { WorkThesis } from '../components/generated/WorkThesis'
import { WorkNarrative } from '../components/generated/WorkNarrative'
import { ContextBlock } from '../components/generated/ContextBlock'
import { ConstraintsBlock } from '../components/generated/ConstraintsBlock'
import { ProcessBlock } from '../components/generated/ProcessBlock'
import { DecisionsBlock } from '../components/generated/DecisionsBlock'
import { ReferencesBlock } from '../components/generated/ReferencesBlock'
import { ScorecardFooter } from '../components/generated/ScorecardFooter'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className={css({ padding: '7' })}>
        <h1 className={css({ textStyle: '3xl', fontFamily: 'display', fontWeight: 'bold' })}>
          Project not found
        </h1>
        <p className={css({ color: 'textMuted', marginTop: '3' })}>
          That case study is not on the board. Head back to{' '}
          <a href="/" className={css({ color: 'accent' })}>
            the work index
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' } })}
      >
        <WorkThesis project={project} />
        <WorkNarrative project={project} />
      </div>
      {project.context ? <ContextBlock text={project.context} /> : null}
      {project.constraints ? <ConstraintsBlock items={project.constraints} /> : null}
      {project.process ? <ProcessBlock steps={project.process} /> : null}
      {project.decisions ? <DecisionsBlock items={project.decisions} /> : null}
      {project.references ? <ReferencesBlock items={project.references} /> : null}
      <ScorecardFooter
        title="The Scorecard"
        dateLabel={`${project.type}, ${project.year}`}
        cells={[
          { label: 'Role', value: project.role ?? 'Independent', sub: project.type },
          { label: 'Year', value: String(project.year), sub: project.depth },
        ]}
      />
    </>
  )
}
