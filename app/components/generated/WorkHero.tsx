import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function extra(project: Project, key: string): string {
  const v: unknown = Reflect.get(project, key)
  return typeof v === 'string' ? v : ''
}

export function WorkHero({ project }: { project: Project }) {
  const meta: [string, string | undefined][] = [
    ['Year', String(project.year)],
    ['Role', project.role],
    ['Timeline', extra(project, 'timeline')],
    ['Status', extra(project, 'status')],
  ]
  const rows = meta.filter((r): r is [string, string] => Boolean(r[1]))
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) 280px' },
        gap: 'clamp(24px, 4vw, 64px)',
        alignItems: 'end',
        paddingInline: 'clamp(24px, 5vw, 72px)',
        paddingTop: 'clamp(40px, 8vh, 96px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
      })}
    >
      <div className={css({ minWidth: '0' })}>
        <h1
          className={css({
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textStyle: { base: '2xl', lg: '5xl' },
            lineHeight: '0.95',
            color: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: { base: '1.5px currentColor', lg: '2.5px currentColor' },
          })}
        >
          {project.title}
        </h1>
        <span
          className={css({
            display: 'inline-block',
            marginTop: '4',
            bg: 'field',
            color: 'fieldInk',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textStyle: 'lg',
            paddingBlock: '2',
            paddingInline: '4',
            borderRadius: 'sm',
          })}
        >
          {project.type}
        </span>
      </div>
      <dl className={css({ margin: '0' })}>
        {rows.map(([k, v]) => (
          <div
            key={k}
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              gap: '3',
              paddingBlock: '2',
              textStyle: 'sm',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <dt className={css({ color: 'textMuted' })}>{k}</dt>
            <dd
              className={css({
                margin: '0',
                color: 'text',
                fontWeight: 'bold',
                textAlign: 'right',
              })}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
