import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'
import { joinParts } from './join'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '160px 1fr' },
        columnGap: '6',
        rowGap: '1',
        paddingBlock: '4',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          color: { base: 'accent', _light: 'text' },
          minWidth: { lg: '160px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <div className={css({ fontSize: 'base', fontWeight: 'bold', color: 'text' })}>
          {joinParts([entry.role, entry.company], ', ')}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'base',
              color: 'textMuted',
              maxWidth: '50ch',
              marginTop: '1',
              marginBottom: '0',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineLedger() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: '7',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel>Practice</SectionLabel>
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
        })}
      >
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
