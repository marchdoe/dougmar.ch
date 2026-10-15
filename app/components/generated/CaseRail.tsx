import type { Project } from '../../content/projects'
import { Score, Sig, SigNote } from './Rail'

function field(p: Project, key: string): string {
  const v: unknown = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function CaseRail({ project }: { project: Project }) {
  const items = [
    { label: 'Type', value: project.type },
    { label: 'Role', value: field(project, 'role') },
    { label: 'Timeline', value: field(project, 'timeline') },
    { label: 'Status', value: field(project, 'status') },
  ].filter((it) => it.value)
  return (
    <>
      <Sig label="Year">
        <Score>{project.year}</Score>
      </Sig>
      {items.map((it) => (
        <Sig key={it.label} label={it.label}>
          <SigNote>{it.value}</SigNote>
        </Sig>
      ))}
    </>
  )
}
