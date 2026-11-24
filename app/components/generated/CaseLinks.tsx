import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live site', url: project.liveUrl },
    { label: 'Open the project', url: project.externalUrl },
    { label: 'Source on GitHub', url: project.githubUrl },
  ].filter((link) => Boolean(link.url))
  return links.length > 0 ? (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            paddingInline: '5',
            bg: 'accent',
            color: 'accentText',
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            _hover: { bg: 'text', textDecoration: 'none' },
          })}
        >
          {link.label} →
        </a>
      ))}
    </div>
  ) : null
}
