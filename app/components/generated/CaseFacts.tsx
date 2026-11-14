import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function str(rec: Record<string, unknown>, key: string): string {
  const v = rec[key]
  return typeof v === 'string' ? v : ''
}

function facts(project: Project) {
  const rec = project as unknown as Record<string, unknown>
  return [
    { k: 'type', v: project.type },
    { k: 'year', v: String(project.year) },
    { k: 'role', v: project.role ?? '' },
    { k: 'timeline', v: str(rec, 'timeline') },
    { k: 'status', v: str(rec, 'status') },
    { k: 'stack', v: (project.stack ?? []).join(', ') },
  ].filter((f) => f.v)
}

const kCls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
})
const vCls = css({ fontSize: 'sm', color: 'text', marginBottom: '4' })
const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
  marginRight: '4',
})

export function CaseFacts({ project }: { project: Project }) {
  return (
    <aside>
      <dl>
        {facts(project).map((f) => (
          <div key={f.k}>
            <dt className={kCls}>{f.k}</dt>
            <dd className={vCls}>{f.v}</dd>
          </div>
        ))}
      </dl>
      {project.liveUrl && (
        <a href={project.liveUrl} className={linkCls}>
          visit the live site ↗
        </a>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} className={linkCls}>
          source on github ↗
        </a>
      )}
    </aside>
  )
}
