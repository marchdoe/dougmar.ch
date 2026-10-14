import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number] & { timeline?: string; status?: string }
type Fact = { label: string; value: string }

export function CaseFacts({ project }: { project: Proj }) {
  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
    { label: 'Stack', value: (project.stack ?? []).join(', ') },
  ].filter((f): f is Fact => Boolean(f.value))
  return (
    <dl
      className={css({
        margin: '0',
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        columnGap: '6',
        rowGap: '4',
      })}
    >
      {facts.map((f) => (
        <div key={f.label}>
          <dt
            className={css({
              fontSize: 'xs',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'textMuted',
            })}
          >
            {f.label}
          </dt>
          <dd className={css({ margin: '0', fontSize: 'sm', color: 'text' })}>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
