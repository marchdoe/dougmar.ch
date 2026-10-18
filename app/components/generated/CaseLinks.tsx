import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Item = (typeof projects)[number]

export function CaseLinks({ project }: { project: Item }) {
  const links = [
    { label: 'Visit the live site', href: project.liveUrl ?? '' },
    { label: 'Open the project', href: project.externalUrl ?? '' },
    { label: 'Source on GitHub', href: project.githubUrl ?? '' },
  ].filter((l) => l.href !== '')
  if (links.length === 0) return null
  // Mockup ice affordance (#52A5E0) has no token; accent carries the link, text in the light scheme.
  return (
    <div className={css({ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '24px' })}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          rel="noreferrer"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            fontSize: '16px',
            color: { base: 'accent', _light: 'text' },
            borderBottom: '1px solid',
            borderColor: { base: 'accent', _light: 'accentAlt' },
            _hover: { color: 'accentAlt' },
          })}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}
