import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]
type Extra = { timeline?: string; status?: string }

function caseMeta(project: Proj) {
  const extra = project as Proj & Extra
  return [
    { label: 'Type', value: String(project.type) },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: extra.timeline ?? '' },
    { label: 'Status', value: extra.status ?? '' },
  ].filter((item) => item.value !== '')
}

export function CaseHead({ project }: { project: Proj }) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(40px, 8vh, 112px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        display: 'grid',
        gap: '5',
      })}
    >
      <a
        href="/#work"
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifySelf: 'start',
        })}
      >
        All work
      </a>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '3xl', md: '4xl', xl: 'hero' },
          lineHeight: 'tight',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <div className={css({ width: '84px', height: '2px', bg: 'accent', opacity: 0.9 })} />
      <dl
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '4',
          columnGap: '7',
          margin: '0',
        })}
      >
        {caseMeta(project).map((m) => (
          <div
            key={m.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}
          >
            <dt
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'accent',
              })}
            >
              {m.label}
            </dt>
            <dd className={css({ margin: '0', fontFamily: 'body', fontSize: 'sm', color: 'text' })}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
