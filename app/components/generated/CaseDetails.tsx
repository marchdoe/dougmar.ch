import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FactList } from './FactList'

type Project = (typeof projects)[number]
type Extra = Project & { timeline?: string; status?: string }
type Fact = { label: string; value: string }

function isFact(f: { label: string; value?: string }): f is Fact {
  return Boolean(f.value)
}

function factsOf(p: Project): Fact[] {
  const x: Extra = p
  return [
    { label: 'Role', value: x.role },
    { label: 'Timeline', value: x.timeline },
    { label: 'Status', value: x.status },
    { label: 'Year', value: String(x.year) },
    { label: 'Type', value: x.type },
  ].filter(isFact)
}

function linksOf(p: Project) {
  return { stack: p.stack ?? [], live: p.liveUrl ?? p.externalUrl ?? '' }
}

export function CaseDetails({ project }: { project: Project }) {
  const { stack, live } = linksOf(project)
  return (
    <section
      aria-label="Case details"
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
        columnGap: 'clamp(24px, 3vw, 40px)',
        rowGap: '5',
        paddingTop: '6',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <FactList heading="On file" facts={factsOf(project)} />
      {stack.length > 0 ? (
        <div>
          <FactList heading="Stack" facts={stack.map((s) => ({ label: 'Tool', value: s }))} />
        </div>
      ) : null}
      {live ? (
        <div className={css({ alignSelf: 'start' })}>
          <a
            href={live}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontFamily: 'body',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              textStyle: 'xs',
              color: 'accent',
              borderBottom: '2px solid',
              borderBottomColor: 'accent',
              _hover: {
                color: 'accentAlt',
                borderBottomColor: 'accentAlt',
                textDecoration: 'none',
              },
            })}
          >
            Visit the live work <span aria-hidden="true">&nbsp;↗</span>
          </a>
        </div>
      ) : null}
    </section>
  )
}
