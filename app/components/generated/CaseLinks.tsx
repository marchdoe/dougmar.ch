import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]
type LinkItem = { label: string; href: string }

export function CaseLinks({ project }: { project: Proj }) {
  const links = [
    { label: 'Visit the live site', href: project.liveUrl },
    { label: 'Open the project', href: project.externalUrl },
    { label: 'Source on GitHub', href: project.githubUrl },
  ].filter((l): l is LinkItem => Boolean(l.href))
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', rowGap: '2' })}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          rel="noopener noreferrer"
          target="_blank"
          className={css({
            display: 'inline-block',
            minHeight: '44px',
            lineHeight: '44px',
            fontSize: 'sm',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'accentAlt',
            _hover: { color: 'text' },
          })}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
