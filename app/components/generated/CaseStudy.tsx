import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'
import { RevealSection } from './RevealSection'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  const narrative = [
    { label: 'Problem', body: project.problem ?? '' },
    { label: 'Approach', body: project.approach ?? '' },
    { label: 'Outcome', body: project.outcome ?? '' },
  ].filter((n) => n.body.length > 0)
  return (
    <RevealSection
      className={css({
        bg: 'surface',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
      })}
    >
      {project.description ? (
        <p
          className={css({ fontSize: 'lede', color: 'text', maxWidth: '50ch', marginBottom: '4' })}
        >
          {project.description}
        </p>
      ) : null}
      {narrative.map((n) => (
        <div key={n.label}>
          <h2
            className={css({
              marginTop: '7',
              marginBottom: '4',
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'accent',
            })}
          >
            {n.label}
          </h2>
          <p
            className={css({
              fontSize: 'base',
              lineHeight: 'loose',
              color: 'text',
              maxWidth: '55ch',
            })}
          >
            {n.body}
          </p>
        </div>
      ))}
      <CaseFacts stack={project.stack ?? []} liveUrl={project.liveUrl} />
    </RevealSection>
  )
}
