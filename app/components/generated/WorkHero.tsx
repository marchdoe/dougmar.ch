import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseNav } from './CaseNav'
import { PageNav } from './PageNav'
import { VoidHero } from './VoidHero'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

export function WorkHero({ project }: { project: Project }) {
  const facts = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
  ].filter((f) => Boolean(f.value))
  return (
    <VoidHero>
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 'clamp(34px, 8vw, 112px)',
          lineHeight: '0.95',
          letterSpacing: '-0.02em',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <dl
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '6',
          rowGap: '3',
          marginTop: '5',
          marginBottom: '0',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {facts.map((f) => (
          <div key={f.label}>
            <dt
              className={css({
                textStyle: 'xs',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'textMuted',
              })}
            >
              {f.label}
            </dt>
            <dd className={css({ textStyle: 'md', color: 'text', margin: '0' })}>{f.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className={css({
          marginTop: '6',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        <CaseNav slug={project.slug} />
      </div>
      <div
        className={css({
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        <PageNav />
      </div>
    </VoidHero>
  )
}
