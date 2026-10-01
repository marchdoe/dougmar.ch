import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        rowGap: '1',
        paddingBlock: '18px',
        paddingInline: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        lg: { gridTemplateColumns: '160px minmax(0, 1fr)', columnGap: '6' },
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontWeight: 'bold',
          color: 'textMuted',
          letterSpacing: 'wide',
          fontVariantNumeric: 'tabular-nums lining-nums',
          lg: { paddingTop: '2' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'normal',
            lineHeight: 'snug',
            color: 'text',
            fontSize: { base: 'base', lg: '2xl' },
          })}
        >
          {entry.role}
        </div>
        <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
          {entry.company}
        </div>
        {entry.description ? (
          <p className={css({ fontSize: 'base', color: 'text', maxWidth: '50ch', marginTop: '2' })}>
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function TimelineIndex() {
  return (
    <section
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel title="Experience" note={`${timeline.length} roles`} />
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((t) => (
          <TimelineRow key={`${t.year}-${t.company}-${t.role}`} entry={t} />
        ))}
      </ol>
    </section>
  )
}
