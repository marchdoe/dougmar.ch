import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

export function WorkHero({ project }: { project: Project }) {
  const clients = (project.clients ?? []).map((c) => c.name).join(', ')
  const meta = [
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: project.role ?? '' },
    { k: 'Timeline', v: project.timeline ?? '' },
    { k: 'Status', v: project.status ?? '' },
    { k: 'Client', v: clients },
  ].filter((m) => m.v !== '')
  return (
    <section className={css({ position: 'relative' })}>
      <div
        className={css({
          paddingTop: 'clamp(40px, 6vw, 96px)',
          paddingBottom: '7',
          paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontSize: 'clamp(40px, 8vw, 112px)',
            lineHeight: '1',
            letterSpacing: '-0.01em',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </div>
      <div
        className={css({
          bg: 'field',
          color: 'fieldInk',
          clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 100%)',
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(28px, 4vw, 48px)',
          paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        })}
      >
        <dl
          className={css({
            margin: '0',
            display: 'grid',
            gridTemplateColumns: {
              base: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(6, minmax(0, 1fr))',
            },
            gap: '5',
          })}
        >
          {meta.map((m) => (
            <div key={m.k} className={css({ minWidth: '0' })}>
              <dt
                className={css({
                  textStyle: 'xs',
                  fontWeight: 'semibold',
                  letterSpacing: 'wider',
                  textTransform: 'uppercase',
                })}
              >
                {m.k}
              </dt>
              <dd
                className={css({
                  margin: '0',
                  marginTop: '1',
                  textStyle: 'base',
                  fontFamily: 'display',
                  fontStyle: 'italic',
                })}
              >
                {m.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
