import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'
import { CaseLinks, CaseStack } from './CaseExtras'

export function CaseBody({ project }: { project: Project }) {
  const blocks = [
    { label: 'Overview', text: project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((b) => b.text)
  return (
    <section
      className={css({ bg: 'surface', paddingTop: '6', paddingBottom: '8', paddingInline: '6vw' })}
    >
      <div className={css({ maxWidth: '1400px', marginInline: 'auto' })}>
        {blocks.map((b) => (
          <div key={b.label}>
            <div
              className={css({
                fontWeight: 'bold',
                fontSize: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'accentAlt',
                marginTop: '6',
                marginBottom: '4',
              })}
            >
              {b.label}
            </div>
            <p
              className={css({
                fontSize: 'lede',
                lineHeight: 'normal',
                color: 'textMuted',
                maxWidth: '60ch',
              })}
            >
              {b.text}
            </p>
          </div>
        ))}
        <CaseStack stack={project.stack ?? []} />
        <CaseLinks project={project} />
      </div>
    </section>
  )
}
