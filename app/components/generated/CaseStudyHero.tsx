import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function optionalField(project: Project, key: string): string | undefined {
  const value = (project as unknown as Record<string, unknown>)[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
        })}
      >
        {label}
      </div>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'medium',
          fontSize: 'sm',
          color: 'fieldInk',
          marginTop: '1',
        })}
      >
        {value}
      </div>
    </div>
  )
}

export function CaseStudyHero({ project }: { project: Project }) {
  const timeline = optionalField(project, 'timeline')
  const status = optionalField(project, 'status')
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        overflow: 'hidden',
        paddingTop: { base: '10', lg: '12' },
        paddingInline: { base: '6vw', lg: '5vw' },
        paddingBottom: '9',
      })}
    >
      <Ground material="grain" seed={1959187987} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <span
          className={css({
            display: 'block',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            marginBottom: '4',
          })}
        >
          {project.type}, {project.year}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: { base: 'lg', lg: 'hero' },
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'fieldInk',
            overflowWrap: 'break-word',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '6',
            rowGap: '2',
            marginTop: '6',
          })}
        >
          {project.role ? <Meta label="Role" value={project.role} /> : null}
          {timeline ? <Meta label="Timeline" value={timeline} /> : null}
          {status ? <Meta label="Status" value={status} /> : null}
        </div>
      </div>
    </section>
  )
}
