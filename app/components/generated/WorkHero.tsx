import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FieldHero } from './FieldHero'

type Project = (typeof projects)[number]

function factsFor(project: Project) {
  const extra: Record<string, unknown> = { ...project }
  const clients = (project.clients ?? []).map((c) => c.name).join(', ')
  return [
    { label: 'year', value: String(project.year) },
    { label: 'type', value: project.type },
    { label: 'role', value: project.role ?? '' },
    { label: 'timeline', value: typeof extra.timeline === 'string' ? extra.timeline : '' },
    { label: 'status', value: typeof extra.status === 'string' ? extra.status : '' },
    { label: 'clients', value: clients },
  ].filter((f) => f.value !== '')
}

export function WorkHero({ project }: { project: Project }) {
  return (
    <FieldHero label={`${project.type} · ${project.year}`}>
      <h1
        className={css({
          marginTop: 'auto',
          paddingTop: '48px',
          textAlign: 'right',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textStyle: { base: '3xl', md: '5xl', xl: 'hero' },
          color: 'fieldInk',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
          md: { paddingTop: '64px' },
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
          paddingLeft: '28px',
          borderTop: '1px solid',
          borderColor: 'fieldBorder',
          paddingTop: '4',
          md: { paddingLeft: '40px' },
        })}
      >
        {factsFor(project).map((fact) => (
          <div key={fact.label}>
            <dt
              className={css({
                textStyle: 'xs',
                color: 'fieldInkMuted',
                textTransform: 'lowercase',
                letterSpacing: 'wide',
              })}
            >
              {fact.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                textStyle: 'sm',
                color: 'fieldInk',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </FieldHero>
  )
}
