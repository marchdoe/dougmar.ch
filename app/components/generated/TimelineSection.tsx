import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SectionLabel } from './SectionLabel'
import { deck, fixedGrid, metaCell, sectionPad } from './rows'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <article className={fixedGrid}>
      <p className={metaCell}>{entry.year}</p>
      <div
        className={css({
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          md: { gridColumn: '3', gridRow: '1' },
        })}
      >
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            color: 'text',
            textStyle: { base: 'base', md: 'xl', lg: '2xl' },
          })}
        >
          {heading}
        </h3>
        {entry.description ? <p className={deck}>{entry.description}</p> : null}
      </div>
    </article>
  )
}

export function TimelineSection() {
  return (
    <RevealSection label="Experience" className={sectionPad}>
      <SectionLabel>experience</SectionLabel>
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
      ))}
    </RevealSection>
  )
}
