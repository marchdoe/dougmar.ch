import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { SectionLabel } from './SectionLabel'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

function projectFacts(p: CaseProject) {
  return [
    { lbl: 'Role', val: p.role ?? '' },
    { lbl: 'Timeline', val: p.timeline ?? '' },
    { lbl: 'Status', val: p.status ?? '' },
    { lbl: 'Stack', val: (p.stack ?? []).join(', ') },
  ].filter((f) => f.val !== '')
}

function projectNarrative(p: CaseProject) {
  return [
    { title: 'Problem', body: p.problem ?? p.description ?? '' },
    { title: 'Approach', body: p.approach ?? '' },
    { title: 'Outcome', body: p.outcome ?? '' },
  ].filter((s) => s.body !== '')
}

export function CaseStudy({ project }: { project: CaseProject }) {
  return (
    <div
      className={css({
        paddingTop: '32px',
        paddingInline: '24px',
        md: { paddingInline: '6vw' },
      })}
    >
      <dl
        className={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          rowGap: '3',
          columnGap: '6',
          margin: '0',
          paddingBlock: '4',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
          md: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          lg: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
        })}
      >
        {projectFacts(project).map((f) => (
          <div key={f.lbl}>
            <dt
              className={css({
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textFaint',
              })}
            >
              {f.lbl}
            </dt>
            <dd className={css({ margin: '0', fontSize: 'sm', color: 'text', marginTop: '1' })}>
              {f.val}
            </dd>
          </div>
        ))}
      </dl>
      {projectNarrative(project).map((s) => (
        <section
          key={s.title}
          className={css({
            marginTop: '56px',
            '@supports (animation-timeline: view())': {
              animationName: 'rise',
              animationTimeline: 'view()',
              animationRange: 'entry 0% entry 40%',
              animationFillMode: 'both',
            },
          })}
        >
          <SectionLabel title={s.title} note={project.title} />
          <p
            className={css({
              fontSize: 'base',
              lineHeight: '1.6',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {s.body}
          </p>
        </section>
      ))}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '40px',
            fontWeight: 'bold',
            fontSize: '13px',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'accent',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'accent',
            paddingBlock: '6px',
            minHeight: '44px',
          })}
        >
          Visit the live project ↗
        </a>
      ) : null}
    </div>
  )
}
