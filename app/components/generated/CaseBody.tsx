import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Band } from './Band'
import { CaseLinks } from './CaseLinks'

type CaseProject = (typeof projects)[number]

export function CaseBody({ project }: { project: CaseProject }) {
  const blocks = [
    { label: 'Problem', body: project.problem },
    { label: 'Approach', body: project.approach },
    { label: 'Outcome', body: project.outcome },
    { label: 'About', body: project.problem ? undefined : project.description },
  ].filter((b) => Boolean(b.body))
  return (
    <Band label="Case study">
      {blocks.map((b) => (
        <div
          key={b.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '160px minmax(0, 1fr)' },
            columnGap: '6',
            alignItems: 'start',
            paddingTop: '6',
            _first: { paddingTop: '0' },
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: { base: '2xs', md: 'sm' },
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'text',
              fontWeight: 'bold',
              marginBottom: '3',
              paddingTop: { md: '5' },
            })}
          >
            {b.label}
          </span>
          <div
            className={css({
              bg: 'surface',
              borderRadius: 'sm',
              paddingBlock: '5',
              paddingInline: '5',
              maxWidth: '52ch',
            })}
          >
            <p
              className={css({
                fontSize: { base: 'base', lg: 'lede' },
                lineHeight: 'normal',
                color: 'text',
                maxWidth: '48ch',
              })}
            >
              {b.body}
            </p>
          </div>
        </div>
      ))}
      <CaseLinks stack={project.stack} liveUrl={project.liveUrl} githubUrl={project.githubUrl} />
    </Band>
  )
}
