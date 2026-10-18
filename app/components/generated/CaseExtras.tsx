import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const labelCls = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: 'xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  marginBottom: '3',
})

export function CaseExtras({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const links: [string, string | undefined][] = [
    ['Live site ↗', project.liveUrl],
    ['Project site ↗', project.externalUrl],
    ['Source ↗', project.githubUrl],
  ]
  const shownLinks = links.filter(([, url]) => Boolean(url))
  return (
    <div className={css({ marginTop: '7', display: 'flex', flexDirection: 'column', gap: '6' })}>
      {stack.length > 0 ? (
        <div>
          <h2 className={labelCls}>Stack</h2>
          <div className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '4' })}>
            {stack.map((item) => (
              <span
                key={item}
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  textStyle: 'xs',
                  letterSpacing: 'wider',
                  textTransform: 'uppercase',
                  color: 'text',
                })}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '5' })}>
        {shownLinks.map(([label, url]) => (
          <a
            key={label}
            href={url}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              minWidth: '44px',
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'accent',
              paddingBlock: '12px',
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'accent',
              _hover: { textDecoration: 'none', color: 'accentAlt' },
            })}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
