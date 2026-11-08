import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function CaseNarrative({ project }: { project: Project }) {
  const blocks = [
    { label: 'Overview', body: project.description },
    { label: 'Problem', body: project.problem },
    { label: 'Approach', body: project.approach },
    { label: 'Outcome', body: project.outcome },
  ].filter((block) => block.body)

  return (
    <div className={css({ minWidth: '0' })}>
      {blocks.map((block) => (
        <div key={block.label} className={css({ marginBottom: '6' })}>
          <h2
            className={css({
              textStyle: 'sm',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'textFaint',
              marginBottom: '3',
            })}
          >
            {block.label}
          </h2>
          <p className={css({ textStyle: 'lede', color: 'text', maxWidth: '58ch' })}>
            {block.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function CaseFacts({ project }: { project: Project }) {
  const facts = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
    { label: 'Stack', value: (project.stack ?? []).join(' · ') },
  ].filter((fact) => fact.value)
  const links = [
    { label: 'Live project', href: project.liveUrl },
    { label: 'Source', href: project.githubUrl },
    { label: 'External link', href: project.externalUrl },
  ].filter((link) => link.href)

  return (
    <aside className={css({ minWidth: '0' })}>
      {facts.map((fact) => (
        <div
          key={fact.label}
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px',
            paddingTop: '12px',
            paddingBottom: '10px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              textStyle: 'xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'textFaint',
              flex: 'none',
            })}
          >
            {fact.label}
          </span>
          <span
            className={css({
              flex: '1',
              minWidth: '12px',
              borderBottomWidth: '2px',
              borderBottomStyle: 'dotted',
              borderBottomColor: 'borderStrong',
              transform: 'translateY(-4px)',
              opacity: 0.6,
            })}
          />
          <span
            className={css({ textStyle: 'sm', color: 'text', textAlign: 'right', minWidth: '0' })}
          >
            {fact.value}
          </span>
        </div>
      ))}
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={css({
            display: 'flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '2',
            fontFamily: 'display',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            textStyle: 'lg',
            color: 'text',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          })}
        >
          {link.label} →
        </a>
      ))}
    </aside>
  )
}

export function CaseBody({ project }: { project: Project }) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px,5vw,80px)',
        paddingInline: 'var(--pad)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1fr) 360px' },
        gap: 'clamp(32px,4vw,56px)',
      })}
    >
      <CaseNarrative project={project} />
      <CaseFacts project={project} />
    </section>
  )
}
