import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const line = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: { base: 'flex', md: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { md: '140px minmax(0, 1fr)' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: '3',
        borderBottom: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      <div
        className={css({
          textStyle: 'xs',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textMuted',
          minWidth: { md: '140px' },
        })}
      >
        {entry.year}
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })}>
        <div className={css({ textStyle: 'base', color: 'text' })}>{line}</div>
        {entry.description ? (
          <p className={css({ textStyle: 'sm', color: 'textMuted', maxWidth: '50ch' })}>
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function AboutTimeline() {
  return (
    <section>
      <SectionHead label="Timeline" />
      <div className={css({ borderTop: '1px solid', borderColor: 'fieldBorder' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </div>
    </section>
  )
}
