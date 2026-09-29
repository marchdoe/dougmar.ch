import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { AboutSection } from './AboutSection'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const head = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
        fontSize: 'base',
      })}
    >
      <span
        className={css({ fontSize: 'sm', color: 'textMuted', fontVariantNumeric: 'tabular-nums' })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <span className={css({ display: 'block', color: 'text' })}>{head}</span>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              fontSize: 'base',
              color: 'textMuted',
              maxWidth: '50ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineList() {
  return (
    <AboutSection label="work history">
      <ul className={css({ listStyle: 'none', paddingInlineStart: '0', margin: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </AboutSection>
  )
}
