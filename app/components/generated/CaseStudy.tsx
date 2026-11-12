import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseMeta } from './CaseMeta'
import { track } from './LedgerParts'

type Project = (typeof projects)[number]

const wrap = css({ rowGap: '48px', alignItems: 'start' })

/* Body step at base so a long name in the lead fits the 328px column, the xl step from md. */
const standfirst = css({
  fontFamily: 'body',
  textStyle: { base: 'md', md: 'xl' },
  lineHeight: { base: '1.4', md: '1.25' },
  color: 'text',
  maxWidth: '34ch',
})

/* One column of copy, then approach beside outcome once the track is wide enough for two. */
const partGrid = css({
  display: 'grid',
  gridTemplateColumns: { base: 'minmax(0, 1fr)', xl: 'repeat(2, minmax(0, 1fr))' },
  columnGap: '32px',
  rowGap: { base: '40px', md: '56px' },
  alignItems: 'start',
  marginTop: { base: '40px', md: '56px' },
  '&:empty': { display: 'none' },
})

const part = css({ minWidth: 0 })

const partHead = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'lg',
  lineHeight: '1.25',
  color: 'text',
})

const partBody = css({
  marginTop: '12px',
  textStyle: 'base',
  lineHeight: '1.55',
  color: 'text',
  maxWidth: '48ch',
})

function CaseBody({ project }: { project: Project }) {
  const lead = project.problem ?? project.description
  const parts = [
    { head: 'Approach', text: project.approach },
    { head: 'Outcome', text: project.outcome },
  ].filter((entry) => entry.text)
  return (
    <div className={css({ minWidth: 0 })}>
      {lead ? <p className={standfirst}>{lead}</p> : null}
      <div className={partGrid}>
        {parts.map((entry) => (
          <section key={entry.head} className={part}>
            <h2 className={partHead}>{entry.head}</h2>
            <p className={partBody}>{entry.text}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <article className={`${track} ${wrap}`}>
      <CaseBody project={project} />
      <CaseMeta project={project} />
    </article>
  )
}
