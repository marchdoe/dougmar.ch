import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseLinks({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links = [
    { label: `Visit ${project.title} →`, href: project.liveUrl },
    { label: 'Source on GitHub →', href: project.githubUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href))
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '5', marginTop: '7' })}>
      {stack.length > 0 ? (
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {stack.map((s) => (
            <span
              key={s}
              className={css({
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textMuted',
                bg: 'surface',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'md',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', rowGap: '2' })}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontSize: 'sm',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'accent',
              _hover: { color: 'accentAlt' },
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
