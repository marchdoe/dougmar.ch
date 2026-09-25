import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Link = { label: string; url: string | undefined }

export function CaseLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live site', url: project.liveUrl },
    { label: 'Source on GitHub', url: project.githubUrl },
    { label: 'Open the project', url: project.externalUrl },
  ].filter((link: Link): link is { label: string; url: string } => Boolean(link.url))
  if (links.length === 0) return null
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '4' })}>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            display: 'inline-block',
            paddingBlock: '3',
            textStyle: 'base',
            color: 'accent',
            borderBottom: '1px solid',
            borderColor: 'accent',
            lineHeight: '1',
            _hover: { color: 'accentAlt', borderColor: 'accentAlt' },
          })}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
