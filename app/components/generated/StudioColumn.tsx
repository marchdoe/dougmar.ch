import type { projects } from '../../content/projects'
import { ColumnTitle } from './ColumnTitle'
import { FeaturedNote } from './FeaturedNote'
import { LedgerRow } from './LedgerRow'

type Project = (typeof projects)[number]

function clientLine(project: Project): string {
  const names = (project.clients ?? []).map((client) => client.name).join(' · ')
  return names ? `Clients: ${names}` : ''
}

export function StudioColumn({ project }: { project: Project }) {
  const meta = [project.type, project.role ?? ''].filter((part) => part !== '').join(' · ')
  const link = project.externalUrl ?? project.liveUrl ?? ''
  return (
    <div>
      <ColumnTitle label="The studio" />
      <LedgerRow
        title={project.title}
        href={`/work/${project.slug}`}
        year={String(project.year)}
        meta={meta}
        note={clientLine(project)}
      />
      <FeaturedNote
        title={project.title}
        problem={project.problem ?? project.description ?? ''}
        link={link}
      />
    </div>
  )
}
