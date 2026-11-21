import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Reveal } from './Reveal'

type Project = (typeof projects)[number]

function links(p: Project) {
  return [
    { label: 'Visit the live site ↗', href: p.liveUrl ?? '' },
    { label: 'Source on GitHub ↗', href: p.githubUrl ?? '' },
    { label: 'External link ↗', href: p.externalUrl ?? '' },
  ].filter((l) => l.href !== '')
}

function CaseAside({ project }: { project: Project }) {
  return (
    <aside className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
      <span
        className={css({
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: '.14em',
          color: 'textMuted',
          marginTop: { base: '6', lg: '0' },
          paddingBottom: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        Stack
      </span>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
          marginTop: '4',
        })}
      >
        {(project.stack ?? []).map((t) => (
          <li
            key={t}
            className={css({
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {t}
          </li>
        ))}
      </ul>
      <div
        className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '24px', marginTop: '4' })}
      >
        {links(project).map((l) => (
          <a
            key={l.href}
            href={l.href}
            rel="noreferrer"
            className={css({
              textStyle: 'sm',
              fontWeight: 'bold',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </aside>
  )
}

export function CaseBody({ project }: { project: Project }) {
  const parts = [
    { label: 'Overview', body: project.description ?? '' },
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((s) => s.body !== '')
  return (
    <Reveal
      className={css({
        paddingTop: { base: '48px', lg: '72px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1.6fr 1fr' },
        columnGap: { lg: '48px' },
        alignItems: { lg: 'start' },
      })}
    >
      <div
        className={css({
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'md',
          paddingInline: { base: '4', lg: '6' },
          minWidth: '0',
        })}
      >
        {parts.map((s) => (
          <div
            key={s.label}
            className={css({
              display: { base: 'flex', md: 'grid' },
              flexDirection: 'column',
              gridTemplateColumns: { md: '160px 1fr' },
              columnGap: '24px',
              rowGap: '8px',
              paddingBlock: '24px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              _last: { borderBottomWidth: '0' },
            })}
          >
            <h2
              className={css({
                fontFamily: 'display',
                fontSize: '26px',
                fontVariant: 'small-caps',
                letterSpacing: '.04em',
                color: 'text',
              })}
            >
              {s.label}
            </h2>
            <p
              className={css({
                textStyle: 'base',
                lineHeight: '1.6',
                color: 'textMuted',
                maxWidth: '48ch',
              })}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
      <CaseAside project={project} />
    </Reveal>
  )
}
