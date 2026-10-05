import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function CaseLinks({ project }: { project: Project }) {
  const pairs: [string, string | undefined][] = [
    ['Visit the live site', project.liveUrl ?? project.externalUrl],
    ['Source on GitHub', project.githubUrl],
  ]
  const links = pairs.flatMap(([label, url]) => (url ? [{ label, url }] : []))
  if (links.length === 0) return null
  return (
    <div
      className={css({
        marginTop: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '28px',
        rowGap: '8px',
      })}
    >
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5ch',
            color: 'fieldInk',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accent',
            paddingBlock: '8px',
            minHeight: '44px',
            _hover: { color: 'fieldInkMuted' },
          })}
        >
          {l.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  )
}
