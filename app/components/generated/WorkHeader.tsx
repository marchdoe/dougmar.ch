import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type P = (typeof projects)[number] & { timeline?: string; status?: string }

export function WorkHeader({ project }: { project: P }) {
  const facts = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: project.timeline ?? '' },
    { label: 'Status', value: project.status ?? '' },
  ].filter((f) => f.value)
  return (
    <section
      className={css({
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(32px, 4vw, 56px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
        lg: { gridTemplateColumns: '2fr 1fr', alignItems: 'end', gap: '48px' },
      })}
    >
      <div>
        <a
          href="/#work"
          className={css({
            fontSize: 'xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
          })}
        >
          The work
        </a>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '4xl',
            lineHeight: '1',
            color: 'text',
          })}
        >
          {project.title}
        </h1>
      </div>
      <dl
        className={css({
          margin: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        })}
      >
        {facts.map((f) => (
          <div key={f.label}>
            <dt
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textFaint',
                fontWeight: 'bold',
              })}
            >
              {f.label}
            </dt>
            <dd className={css({ margin: '0', fontSize: 'sm', color: 'text' })}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
