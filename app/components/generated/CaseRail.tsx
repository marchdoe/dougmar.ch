import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function CaseMeta({ project }: { project: Project }) {
  const rows = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
    { label: 'Stack', value: project.stack?.join(', ') },
  ].filter((row) => row.value)
  return (
    <ul>
      {rows.map((row) => (
        <li
          key={row.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: '96px 1fr',
            columnGap: '16px',
            paddingBlock: '8px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {row.label}
          </span>
          <span className={css({ textStyle: 'sm', color: 'text' })}>{row.value}</span>
        </li>
      ))}
    </ul>
  )
}

function CaseNarrative({ project }: { project: Project }) {
  const sections = [
    { label: 'Overview', text: project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((section) => section.text)
  return (
    <div>
      {sections.map((section) => (
        <section key={section.label}>
          <h2
            className={css({
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'accent',
              marginTop: '24px',
              marginBottom: '12px',
            })}
          >
            {section.label}
          </h2>
          <p className={css({ textStyle: 'base', color: 'text', maxWidth: '50ch' })}>
            {section.text}
          </p>
        </section>
      ))}
    </div>
  )
}

export function CaseRail({ project }: { project: Project }) {
  return (
    <div>
      <CaseMeta project={project} />
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-block',
            marginTop: '16px',
            paddingBottom: '3px',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'accent',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accentAlt',
          })}
        >
          Live project ↗
        </a>
      ) : null}
      <CaseNarrative project={project} />
    </div>
  )
}
