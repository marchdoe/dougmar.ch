import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { SectionHead } from './SectionHead'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const rows = [
    { k: 'Summary', v: project.description },
    { k: 'Problem', v: project.problem },
    { k: 'Approach', v: project.approach },
    { k: 'Outcome', v: project.outcome },
  ].filter((r): r is { k: string; v: string } => Boolean(r.v))
  return (
    <section
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        paddingBottom: '56px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="The work" meta={`${project.type} · ${project.year}`} />
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {rows.map((r) => (
          <div
            key={r.k}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '180px 1fr' },
              columnGap: '5',
              rowGap: '2',
              paddingTop: '7',
              paddingBottom: '5',
              borderBottom: '1px solid',
              borderColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'textFaint',
              })}
            >
              {r.k}
            </span>
            <p
              className={css({
                fontSize: 'base',
                lineHeight: 'normal',
                color: 'text',
                maxWidth: '50ch',
                margin: '0',
              })}
            >
              {r.v}
            </p>
          </div>
        ))}
      </div>
      <CaseLinks project={project} />
    </section>
  )
}
