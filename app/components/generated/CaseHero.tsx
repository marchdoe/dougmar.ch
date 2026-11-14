import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { HeroField } from './HeroField'

type Entry = (typeof projects)[number]
type Fact = [string, string | undefined]

function isFact(f: Fact): f is [string, string] {
  return typeof f[1] === 'string' && f[1] !== ''
}

export function CaseHero({ project }: { project: Entry }) {
  const extra: { timeline?: string; status?: string } = project
  const facts: Fact[] = [
    ['Type', project.type],
    ['Year', String(project.year)],
    ['Role', project.role],
    ['Timeline', extra.timeline],
    ['Status', extra.status],
    ['Clients', project.clients?.map((c) => c.name).join(', ')],
  ]
  return (
    <HeroField label={project.title}>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'accent',
          marginBottom: '3',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Case study
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          fontSize: { base: '3xl', lg: '4xl' },
          lineHeight: 'tight',
          color: 'fieldInk',
          textAlign: 'left',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <dl
        className={css({
          marginTop: '6',
          marginBottom: '0',
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          columnGap: '4',
          rowGap: '4',
        })}
      >
        {facts.filter(isFact).map(([k, v]) => (
          <div
            key={k}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'fieldBorder',
              paddingTop: '2',
            })}
          >
            <dt
              className={css({
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'fieldInkMuted',
              })}
            >
              {k}
            </dt>
            <dd className={css({ margin: '0', marginTop: '1', fontSize: 'sm', color: 'fieldInk' })}>
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </HeroField>
  )
}
