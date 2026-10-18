import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Item = (typeof projects)[number]

function asText(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export function CaseHead({ project }: { project: Item }) {
  const extra: Record<string, unknown> = { ...project }
  const data = [
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: asText(extra.role) },
    { k: 'Type', v: project.type },
    { k: 'Timeline', v: asText(extra.timeline) },
    { k: 'Status', v: asText(extra.status) },
  ].filter((d) => d.v !== '')
  return (
    <section
      className={css({
        paddingTop: { base: '40px', lg: '80px' },
        paddingBottom: { base: '40px', lg: '72px' },
      })}
    >
      <div
        className={css({
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textMuted',
          marginBottom: '24px',
        })}
      >
        Selected work
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(40px, 11vw, 56px)', lg: 'clamp(64px, 10vw, 160px)' },
          lineHeight: '0.9',
          letterSpacing: '-0.02em',
          color: { base: 'accent', _light: 'accentAlt' },
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          marginTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '14px',
          columnGap: '28px',
        })}
      >
        {data.map((d) => (
          <div
            key={d.k}
            className={css({ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' })}
          >
            <span
              className={css({
                fontSize: '13px',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'textFaint',
              })}
            >
              {d.k}
            </span>
            <span className={css({ fontSize: '15px', color: 'text' })}>{d.v}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
