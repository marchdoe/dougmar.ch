import type { projects } from '../../content/projects'
import { css } from '../../../styled-system/css'

type Project = (typeof projects)[number]

function CaseNarrative({ project }: { project: Project }) {
  const parts = [
    { label: 'Summary', body: project.description ?? '' },
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((p) => p.body !== '')
  return (
    <div>
      {parts.map((part) => (
        <article
          key={part.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '260px minmax(0, 1fr)' },
            columnGap: '6',
            rowGap: '2',
            paddingBlock: '6',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          <h2
            className={css({
              alignSelf: 'start',
              minWidth: '0',
              paddingTop: '2',
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              borderTopColor: 'accent',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              textStyle: 'xl',
              letterSpacing: 'wide',
              color: 'accentAlt',
            })}
          >
            {part.label}
          </h2>
          <p className={css({ textStyle: 'lede', color: 'text', maxWidth: '46ch' })}>{part.body}</p>
        </article>
      ))}
    </div>
  )
}

function CaseLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live site →', href: project.liveUrl ?? '' },
    { label: 'Source on GitHub →', href: project.githubUrl ?? '' },
    { label: 'Open the project →', href: project.externalUrl ?? '' },
  ].filter((l, i, all) => l.href !== '' && all.findIndex((o) => o.href === l.href) === i)
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
        paddingBlock: '6',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {(project.stack ?? []).map((s) => (
          <li
            key={s}
            className={css({
              paddingBlock: '1',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '5' })}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              textStyle: 'sm',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'accentAlt',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'accent',
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function CaseBody({ project }: { project: Project }) {
  return (
    <section
      aria-label="Case study"
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(20px, 6vw, 96px)',
        paddingBlock: 'clamp(24px, 4vw, 48px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <CaseNarrative project={project} />
      <CaseLinks project={project} />
    </section>
  )
}
