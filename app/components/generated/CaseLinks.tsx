import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginRight: '6',
  textStyle: 'sm',
  fontWeight: 'bold',
  color: 'text',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function CaseLinks({ project }: { project: Project }) {
  const links = [
    { label: 'Visit the live product ↗', url: project.liveUrl },
    { label: 'Read the code ↗', url: project.githubUrl },
    { label: 'Open the project ↗', url: project.externalUrl },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url))
  const stack = project.stack ?? []
  return (
    <div className={css({ marginTop: '6' })}>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {stack.map((s) => (
          <span
            key={s}
            className={css({
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'text',
              bg: 'surface',
              paddingBlock: '2',
              paddingInline: '3',
              borderRadius: 'sm',
            })}
          >
            {s}
          </span>
        ))}
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', marginTop: '4' })}>
        {links.map((l) => (
          <a key={l.url} href={l.url} className={link}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
