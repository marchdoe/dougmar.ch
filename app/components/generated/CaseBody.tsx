import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'

type Project = (typeof projects)[number]

const label = css({
  textStyle: 'xs',
  fontVariant: 'small-caps',
  letterSpacing: 'widest',
  color: 'textMuted',
  marginBottom: '2',
})

export function CaseBody({ project }: { project: Project }) {
  const stack = project.stack ?? []
  const narrative = [
    { k: 'In brief', v: project.description },
    { k: 'Approach', v: project.approach },
    { k: 'Outcome', v: project.outcome },
  ].filter((item): item is { k: string; v: string } => Boolean(item.v))
  return (
    <section
      className={css({
        maxWidth: '760px',
        marginInline: 'auto',
        paddingInline: { base: '4', lg: '7' },
        paddingBottom: { base: '7', lg: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
      })}
    >
      {project.problem ? (
        <p
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: { base: '20px', lg: '28px' },
            lineHeight: 'snug',
            letterSpacing: 'normal',
            color: 'textMuted',
            maxWidth: '34ch',
            marginInline: 'auto',
            textAlign: 'center',
          })}
        >
          {project.problem}
        </p>
      ) : null}
      {narrative.map((item) => (
        <div
          key={item.k}
          className={css({ borderTop: '1px solid', borderColor: 'fieldBorder', paddingTop: '4' })}
        >
          <h2 className={label}>{item.k}</h2>
          <p
            className={css({
              fontFamily: 'body',
              textStyle: 'base',
              lineHeight: 'loose',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {item.v}
          </p>
        </div>
      ))}
      {stack.length > 0 ? (
        <div
          className={css({ borderTop: '1px solid', borderColor: 'fieldBorder', paddingTop: '4' })}
        >
          <h2 className={label}>Stack</h2>
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
            {stack.map((item) => (
              <li
                key={item}
                className={css({
                  textStyle: 'sm',
                  color: 'text',
                  border: '1px solid',
                  borderColor: 'fieldBorder',
                  borderRadius: 'full',
                  paddingBlock: '1',
                  paddingInline: '3',
                })}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <CaseLinks project={project} />
    </section>
  )
}
