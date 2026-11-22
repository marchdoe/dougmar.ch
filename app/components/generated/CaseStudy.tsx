import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { RevealSection } from './RevealSection'
import { SectionLabel } from './SectionLabel'
import { deck, metaCell, rowGrid, visit } from './rows'

type Project = (typeof projects)[number]
type Row = { label: string; body: string }

const bodyCell = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  md: { gridColumn: '3', gridRow: '1' },
})

function narrativeRows(project: Project): Row[] {
  const rows = [
    { label: 'the brief', body: project.description ?? '' },
    { label: 'problem', body: project.problem ?? '' },
    { label: 'approach', body: project.approach ?? '' },
    { label: 'outcome', body: project.outcome ?? '' },
  ]
  return rows.filter((r) => r.body !== '')
}

function CaseLinks({ project }: { project: Project }) {
  const url = project.liveUrl ?? project.externalUrl ?? ''
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        columnGap: '6',
        rowGap: '2',
        marginTop: '6',
      })}
    >
      {url ? (
        <a href={url} className={visit}>
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
        </a>
      ) : null}
      <a href="/" className={visit}>
        back to the index
      </a>
    </div>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <RevealSection
      label="Case study"
      className={css({
        paddingTop: '8px',
        paddingBottom: '64px',
        paddingInline: '20px',
        md: { paddingTop: '0', paddingBottom: '96px', paddingInline: '6vw' },
      })}
    >
      <SectionLabel>the work</SectionLabel>
      {narrativeRows(project).map((row) => (
        <article key={row.label} className={rowGrid}>
          <p className={metaCell}>{row.label}</p>
          <div className={bodyCell}>
            <p className={deck}>{row.body}</p>
          </div>
        </article>
      ))}
      {stack.length > 0 ? (
        <article className={rowGrid}>
          <p className={metaCell}>stack</p>
          <ul
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              columnGap: '4',
              rowGap: '1',
              md: { gridColumn: '3', gridRow: '1' },
            })}
          >
            {stack.map((item) => (
              <li
                key={item}
                className={css({ textStyle: 'sm', color: 'textMuted', textTransform: 'lowercase' })}
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      ) : null}
      <CaseLinks project={project} />
    </RevealSection>
  )
}
