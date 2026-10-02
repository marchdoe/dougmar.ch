import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Outbound = { label: string; href: string }

const label = css({
  textStyle: 'sm',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'textMuted',
  marginBottom: '3',
})

export function CaseFacts({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links = [
    { label: 'Live product', href: project.liveUrl },
    { label: 'Project link', href: project.externalUrl },
    { label: 'Source on GitHub', href: project.githubUrl },
  ].filter((l): l is Outbound => Boolean(l.href))
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', rowGap: '6' })}>
      {stack.length > 0 && (
        <div>
          <h2 className={label}>Stack</h2>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '4',
              rowGap: '2',
            })}
          >
            {stack.map((item) => (
              <li
                key={item}
                className={css({
                  fontSize: 'sm',
                  color: 'text',
                  _before: {
                    content: '""',
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    bg: 'accent',
                    marginRight: '2',
                  },
                })}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {links.length > 0 && (
        <div className={css({ display: 'flex', flexDirection: 'column' })}>
          <h2 className={label}>Links</h2>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={css({
                color: 'accent',
                fontWeight: 'bold',
                textStyle: 'sm',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                _hover: { color: 'accentAlt' },
              })}
            >
              {l.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
