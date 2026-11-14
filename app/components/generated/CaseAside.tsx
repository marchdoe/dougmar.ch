import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Entry = (typeof projects)[number]

const head = css({
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textFaint',
  marginBottom: '3',
})

export function CaseAside({ project }: { project: Entry }) {
  const url = project.liveUrl ?? project.externalUrl
  return (
    <aside
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        flexWrap: 'wrap',
        alignItems: { base: 'flex-start', md: 'flex-end' },
        columnGap: '7',
        rowGap: '5',
        paddingTop: '5',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      {project.stack ? (
        <div className={css({ flex: { md: '1 1 320px' } })}>
          <div className={head}>Stack</div>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2',
            })}
          >
            {project.stack.map((s) => (
              <li
                key={s}
                className={css({
                  bg: 'surface',
                  color: 'text',
                  fontSize: 'sm',
                  paddingInline: '3',
                  paddingBlock: '1',
                  borderRadius: 'sm',
                })}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {url ? (
        <a
          href={url}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2',
            minHeight: '44px',
            fontFamily: 'body',
            fontSize: 'sm',
            letterSpacing: 'wide',
            color: { base: 'accent', _light: 'accentAlt' },
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
          })}
        >
          Visit the project
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontSize: 'sm',
          color: 'textMuted',
        })}
      >
        All work
      </a>
    </aside>
  )
}
