import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { extLinkClass } from './styles'
import { hostOf } from './url'

type Project = (typeof projects)[number]

export function ProjectLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit', url: project.liveUrl ?? project.externalUrl ?? '' },
    { label: 'Source on', url: project.githubUrl ?? '' },
  ].filter((l) => l.url !== '')
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: '4',
      })}
    >
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={extLinkClass}
        >
          {l.label} {hostOf(l.url)} →
        </a>
      ))}
    </div>
  )
}
