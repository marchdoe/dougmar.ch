import type { projects } from '../../content/projects'
import { ColumnTitle } from './ColumnTitle'
import { LedgerRow } from './LedgerRow'

type Project = (typeof projects)[number]

export function LedgerColumn({ label, items }: { label: string; items: Project[] }) {
  return (
    <div>
      <ColumnTitle label={label} />
      {items.map((project) => (
        <LedgerRow
          key={project.slug}
          title={project.title}
          href={`/work/${project.slug}`}
          year={String(project.year)}
          meta={project.type}
        />
      ))}
    </div>
  )
}
