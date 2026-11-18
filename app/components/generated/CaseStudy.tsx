import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const labelClass = css({
  display: 'block',
  marginTop: '0',
  marginBottom: '3',
  textStyle: 'sm',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  fontWeight: 'semibold',
  color: 'textMuted',
})

export function CaseStudy({ project }: { project: Project }) {
  const blocks = [
    { k: 'Summary', v: project.description ?? '' },
    { k: 'Problem', v: project.problem ?? '' },
    { k: 'Approach', v: project.approach ?? '' },
    { k: 'Outcome', v: project.outcome ?? '' },
  ].filter((b) => b.v !== '')
  const links = [
    { k: 'Visit the live project', v: project.liveUrl ?? '' },
    { k: 'Visit the project', v: project.externalUrl ?? '' },
    { k: 'Source on GitHub', v: project.githubUrl ?? '' },
  ].filter((l) => l.v !== '')
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        paddingTop: '7',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          columnGap: '6',
          rowGap: '7',
        })}
      >
        {blocks.map((b) => (
          <div
            key={b.k}
            className={css({
              minWidth: '0',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              paddingTop: '4',
            })}
          >
            <h2 className={labelClass}>{b.k}</h2>
            <p
              className={css({
                margin: '0',
                textStyle: 'base',
                lineHeight: 'normal',
                maxWidth: '46ch',
              })}
            >
              {b.v}
            </p>
          </div>
        ))}
      </div>
      {stack.length > 0 ? (
        <div className={css({ marginTop: '7' })}>
          <h2 className={labelClass}>Stack</h2>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '5',
              rowGap: '2',
            })}
          >
            {stack.map((s) => (
              <li
                key={s}
                className={css({
                  textStyle: 'base',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                })}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ul
        className={css({
          listStyle: 'none',
          marginTop: '7',
          marginBottom: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5',
        })}
      >
        {links.map((l) => (
          <li key={l.k}>
            <a
              href={l.v}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                textStyle: 'sm',
                fontWeight: 'semibold',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'field',
                _hover: { color: 'fieldBorder' },
              })}
            >
              {l.k} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
