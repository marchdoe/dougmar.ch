import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ClientLedger } from './ClientLedger'
import { DrenchLedger } from './DrenchLedger'
import { Narrative } from './Narrative'
import { ProjectLinks } from './ProjectLinks'
import { microClass, revealClass, sectionPadClass } from './styles'

type Project = (typeof projects)[number]

function factsFor(project: Project) {
  const extra = project as unknown as { timeline?: string; status?: string }
  return [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: extra.timeline ?? '' },
    { label: 'Status', value: extra.status ?? '' },
    { label: 'Stack', value: (project.stack ?? []).join(', ') },
  ]
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section className={revealClass}>
        <div
          className={`${sectionPadClass} ${css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '1fr 2fr' },
            gap: { base: '40px', lg: '6vw' },
            alignItems: 'start',
          })}`}
        >
          <div>
            <div className={microClass}>Facts</div>
            <DrenchLedger rows={factsFor(project)} />
            <ProjectLinks project={project} />
          </div>
          <Narrative project={project} />
        </div>
      </section>
      <ClientLedger clients={project.clients ?? []} />
    </>
  )
}
