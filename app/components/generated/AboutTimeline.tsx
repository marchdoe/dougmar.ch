import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { bleed, Label, SectionHead, track } from './LedgerParts'

type Entry = (typeof timeline)[number]

const section = css({ marginTop: { base: '64px', md: '96px' } })

const list = css({
  listStyle: 'none',
  marginTop: '0px',
  marginBottom: '0px',
})

const row = css({
  rowGap: '6px',
  alignItems: 'start',
  paddingTop: { base: '16px', md: '20px' },
  paddingBottom: { base: '16px', md: '20px' },
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  '&:first-child': { borderTopWidth: '0px' },
})

const yearCell = css({
  gridColumn: { md: '2' },
  gridRow: { md: '1' },
  paddingTop: { md: '6px' },
})

const bodyCell = css({
  gridColumn: { md: '1' },
  gridRow: { md: '1' },
  minWidth: 0,
})

/* Body size and face at base, the lg display step once the two-track row starts. */
const role = css({
  fontFamily: { base: 'body', md: 'display' },
  fontWeight: 'bold',
  textStyle: { base: 'base', md: 'lg' },
  lineHeight: '1.25',
  color: 'text',
})

const company = css({
  textStyle: 'base',
  lineHeight: '1.5',
  color: 'textMuted',
})

const description = css({
  marginTop: '8px',
  textStyle: 'base',
  lineHeight: '1.55',
  color: 'text',
  maxWidth: '56ch',
})

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li className={`${track} ${row}`}>
      <div className={yearCell}>
        <Label>{entry.year}</Label>
      </div>
      <div className={bodyCell}>
        <h3 className={role}>{entry.role}</h3>
        <p className={company}>{entry.company}</p>
        {entry.description ? <p className={description}>{entry.description}</p> : null}
      </div>
    </li>
  )
}

export function AboutTimeline() {
  return (
    <section className={section} aria-labelledby="experience-h">
      <SectionHead id="experience-h">Experience</SectionHead>
      <ol className={`${bleed} ${list}`}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year} ${entry.company} ${entry.role}`} entry={entry} />
        ))}
      </ol>
    </section>
  )
}
