import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { EvLabel } from './Panel'

type Project = (typeof projects)[number]

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderColor: 'accent',
  _hover: { color: 'textMuted' },
})

export function CaseLinks({ stack, project }: { stack: string[]; project: Project }) {
  const links = [
    { label: 'Live site', url: project.liveUrl },
    { label: 'Visit the project', url: project.externalUrl },
    { label: 'Source on GitHub', url: project.githubUrl },
  ].flatMap((l) => (l.url ? [{ label: l.label, url: l.url }] : []))
  return (
    <div
      className={css({
        marginTop: '6',
        paddingTop: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
      })}
    >
      {stack.length > 0 ? (
        <div className={css({ marginBottom: '4' })}>
          <EvLabel>Stack</EvLabel>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              rowGap: '2',
              columnGap: '4',
            })}
          >
            {stack.map((s) => (
              <li
                key={s}
                className={css({
                  fontSize: 'sm',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                  color: 'text',
                })}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '4' })}>
        {links.map((l) => (
          <a key={l.label} href={l.url} className={linkClass}>
            {l.label} →
          </a>
        ))}
        <a href="/work" className={linkClass}>
          All work
        </a>
      </div>
    </div>
  )
}
