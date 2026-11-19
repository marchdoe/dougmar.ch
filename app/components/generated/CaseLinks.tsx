import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Link = { label: string; href: string }

export function CaseLinks({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links = [
    { label: `Visit ${project.title}`, href: project.liveUrl },
    { label: 'Source', href: project.githubUrl },
  ].filter((l): l is Link => typeof l.href === 'string' && l.href !== '')
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '5', marginTop: '7' })}>
      {stack.length > 0 && (
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '2',
            columnGap: '4',
            borderTop: '1px solid',
            borderColor: 'borderStrong',
            paddingTop: '4',
          })}
        >
          {stack.map((s) => (
            <span
              key={s}
              className={css({
                fontSize: 'sm',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'textMuted',
              })}
            >
              {s}
            </span>
          ))}
        </div>
      )}
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '5' })}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '48px',
              fontSize: 'base',
              fontWeight: 'bold',
              color: 'accent',
              borderBottom: '1px solid',
              borderColor: 'accentAlt',
              paddingBlock: '2',
              _hover: { borderColor: 'accent' },
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
