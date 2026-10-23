import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseClients } from './CaseClients'
import { CaseLinks } from './CaseLinks'
import { CaseNarrative } from './CaseNarrative'
import { StackList } from './StackList'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        display: 'grid',
        gap: 'clamp(32px, 4vw, 56px)',
        gridTemplateColumns: { lg: 'minmax(0, 1.5fr) minmax(280px, 1fr)' },
        alignItems: 'start',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <CaseNarrative project={project} />
      <aside
        aria-label="Project details"
        className={css({ display: 'flex', flexDirection: 'column', gap: '22px' })}
      >
        <CaseLinks liveUrl={project.liveUrl} githubUrl={project.githubUrl} />
        <StackList items={project.stack} />
        <CaseClients clients={project.clients} />
      </aside>
    </section>
  )
}
