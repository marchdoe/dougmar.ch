import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Ground } from '../Material'

type Project = (typeof projects)[number]

function readString(source: object, key: string): string {
  const value: unknown = (source as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

function metaRows(project: Project) {
  const clients = (project.clients ?? []).map((client) => client.name).join(', ')
  return [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: readString(project, 'timeline') },
    { label: 'Status', value: readString(project, 'status') },
    { label: 'Clients', value: clients },
  ].filter((row) => row.value !== '')
}

export function CaseHero({ project }: { project: Project }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        overflow: 'hidden',
        paddingInline: '6vw',
        paddingTop: { base: '48px', xl: '64px' },
        paddingBottom: { base: '56px', md: '72px', xl: '88px' },
      })}
    >
      <Ground material="rule" seed={1908855130} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) 20rem' },
          columnGap: '48px',
          rowGap: '32px',
          alignItems: 'end',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontSize: { base: '4xl', lg: '5xl' },
            lineHeight: '0.95',
            letterSpacing: '-0.02em',
            color: 'text',
            textAlign: 'left',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <dl
          className={css({
            margin: '0',
            display: 'grid',
            gap: '10px',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {metaRows(project).map((row) => (
            <div
              key={row.label}
              className={css({
                display: 'grid',
                gridTemplateColumns: '7rem minmax(0, 1fr)',
                columnGap: '12px',
                alignItems: 'baseline',
              })}
            >
              <dt
                className={css({
                  fontFamily: 'body',
                  fontSize: 'xs',
                  fontWeight: 600,
                  fontVariantCaps: 'all-small-caps',
                  letterSpacing: 'wide',
                  color: 'textFaint',
                })}
              >
                {row.label}
              </dt>
              <dd
                className={css({ margin: '0', fontFamily: 'body', fontSize: 'sm', color: 'text' })}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
