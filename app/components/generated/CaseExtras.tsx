import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

export function CaseStack({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className={css({ marginTop: '6' })}>
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '3',
        })}
      >
        Stack
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '4', rowGap: '2' })}>
        {stack.map((s) => (
          <span
            key={s}
            className={css({
              fontSize: 'sm',
              color: 'text',
              paddingBlock: '1',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'fieldBorder',
              borderRadius: 'sm',
            })}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function CaseLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live site', href: project.liveUrl },
    { label: 'Source on GitHub', href: project.githubUrl },
  ].filter((l) => l.href)
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', marginTop: '5' })}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            fontWeight: 'bold',
            fontSize: 'sm',
            paddingBlock: '12px',
            minHeight: '44px',
            color: 'accent',
            _hover: { color: 'accentAlt' },
          })}
        >
          {l.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: 'sm',
          paddingBlock: '12px',
          minHeight: '44px',
          color: 'text',
          _hover: { color: 'accentAlt' },
        })}
      >
        All work
      </a>
    </div>
  )
}
