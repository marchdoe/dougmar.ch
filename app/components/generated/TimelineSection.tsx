import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionHeading } from './SectionHeading'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const who = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '150px 1fr' },
        columnGap: '24px',
        rowGap: '4px',
        alignItems: 'baseline',
        paddingBlock: '14px',
        paddingInline: '8px',
        maxWidth: 'none',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={`tnum ${css({ fontFamily: 'display', fontSize: 'sm', color: 'textMuted' })}`}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <div className={css({ fontSize: { base: 'sm', md: 'base' }, color: 'text' })}>{who}</div>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'base',
              color: 'textMuted',
              maxWidth: '48ch',
              marginTop: '6px',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineSection() {
  return (
    <section
      className={css({
        maxWidth: '720px',
        marginInline: 'auto',
        paddingTop: '64px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        boxSizing: 'content-box',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="the long card" title="where the years went" flush />
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          marginTop: '24px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
