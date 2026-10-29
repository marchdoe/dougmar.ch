import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function asText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function CaseMeta({ project }: { project: Project }) {
  const extra = project as unknown as Record<string, unknown>
  const rows = [
    { lab: 'Year', val: String(project.year) },
    { lab: 'Type', val: String(project.type) },
    { lab: 'Role', val: asText(project.role) },
    { lab: 'Timeline', val: asText(extra.timeline) },
    { lab: 'Status', val: asText(extra.status) },
    { lab: 'Clients', val: (project.clients ?? []).map((c) => c.name).join(', ') },
  ].filter((row) => row.val)
  return (
    <dl
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: '1fr' },
        rowGap: '4',
        columnGap: '5',
        margin: '0',
      })}
    >
      {rows.map((row) => (
        <div key={row.lab}>
          <dt
            className={css({
              fontSize: '2xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
              marginBottom: '1',
            })}
          >
            {row.lab}
          </dt>
          <dd
            className={css({
              margin: '0',
              fontFamily: 'display',
              fontSize: 'md',
              lineHeight: 'snug',
              color: 'text',
            })}
          >
            {row.val}
          </dd>
        </div>
      ))}
    </dl>
  )
}
