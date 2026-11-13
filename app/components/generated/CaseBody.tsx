import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { label, reveal, stackGrid } from './styles'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const parts = [
    { name: 'Problem', body: project.problem ?? '' },
    { name: 'Approach', body: project.approach ?? '' },
    { name: 'Outcome', body: project.outcome ?? '' },
  ].filter((p) => p.body !== '')
  return (
    <section className={cx(reveal, css({ marginTop: '80px' }))}>
      <div
        className={cx(
          stackGrid,
          css({ gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' } })
        )}
      >
        {parts.map((p) => (
          <div
            key={p.name}
            className={css({
              bg: 'bg',
              minWidth: '0',
              paddingTop: '6',
              paddingBottom: '6',
              paddingInline: '22px',
            })}
          >
            <h2 className={cx(label, css({ color: 'textMuted', marginBottom: '2' }))}>{p.name}</h2>
            <p
              className={css({
                fontSize: 'base',
                lineHeight: '1.55',
                color: 'text',
                maxWidth: '62ch',
                margin: '0',
              })}
            >
              {p.body}
            </p>
          </div>
        ))}
        <CaseLinks project={project} />
      </div>
    </section>
  )
}
