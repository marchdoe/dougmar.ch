import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function extra(project: Project, key: string): string {
  const value: unknown = (project as unknown as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

export function CaseHead({ project }: { project: Project }) {
  const meta = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: extra(project, 'timeline') },
    { label: 'Status', value: extra(project, 'status') },
  ].filter((item) => Boolean(item.value))
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        paddingTop: { base: '40px', lg: '64px' },
        paddingBottom: { base: '40px', lg: '56px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <a
        href="/work"
        className={css({
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
        })}
      >
        ← All work
      </a>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: { base: '2xl', lg: 'hero' },
          lineHeight: '0.9',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        {project.title}
      </h1>
      <dl
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '7',
          rowGap: '4',
          margin: '0',
          marginTop: '3',
        })}
      >
        {meta.map((item) => (
          <div key={item.label}>
            <dt
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textFaint',
              })}
            >
              {item.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'xl',
                color: 'text',
              })}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
