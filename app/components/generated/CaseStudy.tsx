import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { sentence } from './copyText'

type Project = (typeof projects)[number]

const kickerClass = css({
  textStyle: 'xs',
  fontWeight: 'bold',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'accent',
  marginBottom: '2',
})

function CaseList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h2 className={kickerClass}>{label}</h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        {items.map((item) => (
          <li
            key={item}
            className={css({
              paddingBlock: '2',
              fontSize: 'base',
              color: 'text',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CaseLink({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.externalUrl ?? project.githubUrl
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={css({
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        color: 'text',
        fontSize: '15px',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        _hover: { color: 'accent' },
      })}
    >
      <span
        className={css({
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          paddingBottom: '2px',
        })}
      >
        Visit {project.title} →
      </span>
    </a>
  )
}

function CaseAside({ project }: { project: Project }) {
  const clients = (project.clients ?? []).map((client) => client.name)
  return (
    <aside className={css({ display: 'flex', flexDirection: 'column', gap: '6', minWidth: '0' })}>
      <CaseList label="Stack" items={project.stack ?? []} />
      <CaseList label="Clients" items={clients} />
      <CaseLink project={project} />
    </aside>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const narrative = [
    { label: 'Overview', body: sentence(project.description) },
    { label: 'Problem', body: sentence(project.problem) },
    { label: 'Approach', body: sentence(project.approach) },
    { label: 'Outcome', body: sentence(project.outcome) },
  ].filter((part) => part.body)
  return (
    <section
      className={css({
        bg: 'surface',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingBlock: 'clamp(48px,6vh,96px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '8fr 4fr' },
        gap: { base: 'clamp(48px,6vh,96px)', lg: 'clamp(28px,6vw,112px)' },
        alignItems: { lg: 'start' },
        // From lg only: on a phone this tall section rests mid-fade under the hero, which drops its small type below 4.5:1.
        lg: {
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        },
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6', minWidth: '0' })}>
        {narrative.map((part) => (
          <div key={part.label}>
            <h2 className={kickerClass}>{part.label}</h2>
            <p
              className={css({
                fontSize: '16px',
                lineHeight: '1.55',
                color: 'textMuted',
                maxWidth: '56ch',
              })}
            >
              {part.body}
            </p>
          </div>
        ))}
      </div>
      <CaseAside project={project} />
    </section>
  )
}
