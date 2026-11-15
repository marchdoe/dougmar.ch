import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type P = (typeof projects)[number]

export function CaseStudy({ project }: { project: P }) {
  const blocks = [
    { label: 'Overview', body: project.description ?? '' },
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((b) => b.body)
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 72px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bgAlt',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '7',
        columnGap: '7',
        lg: { gridTemplateColumns: 'repeat(2, 1fr)', rowGap: '7', columnGap: '8' },
      })}
    >
      {blocks.map((b) => (
        <div key={b.label}>
          <h2
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
              fontWeight: 'bold',
              marginBottom: '12px',
            })}
          >
            {b.label}
          </h2>
          <p
            className={css({
              fontSize: 'base',
              color: 'text',
              lineHeight: '1.6',
              maxWidth: '50ch',
              margin: '0',
            })}
          >
            {b.body}
          </p>
        </div>
      ))}
      <div
        className={css({
          bg: 'field',
          color: 'fieldInk',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          borderRadius: 'sm',
          padding: 'clamp(24px, 3vw, 40px)',
          alignSelf: 'start',
        })}
      >
        <h2
          className={css({
            fontSize: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            fontWeight: 'bold',
            marginBottom: '12px',
          })}
        >
          Built with
        </h2>
        {stack.length > 0 ? (
          <ul
            className={css({
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            })}
          >
            {stack.map((s) => (
              <li
                key={s}
                className={css({
                  fontSize: 'sm',
                  color: 'fieldInk',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'fieldBorder',
                  borderRadius: 'sm',
                  paddingBlock: '6px',
                  paddingInline: '12px',
                })}
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '24px',
              fontSize: 'sm',
              fontWeight: 'bold',
              color: 'fieldInk',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'fieldInk',
              borderRadius: 'md',
              paddingBlock: '11px',
              paddingInline: '20px',
              minHeight: '44px',
              _hover: { color: 'accent', borderColor: 'accent' },
            })}
          >
            Visit {project.title} →
          </a>
        ) : null}
      </div>
    </section>
  )
}
