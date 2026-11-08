import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

function TimelineRow({ entry }: { entry: (typeof timeline)[number] }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '160px minmax(0,1fr)' },
        columnGap: '4',
        rowGap: '1',
        paddingTop: '16px',
        paddingBottom: '14px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'textMuted',
        '&:nth-child(n+6)': { paddingTop: '10px', paddingBottom: '9px' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: { base: 'base', md: 'lg' },
          color: 'text',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ display: 'flex', alignItems: 'baseline', gap: '12px', minWidth: '0' })}>
        <span
          className={css({
            textStyle: { base: 'sm', md: 'base' },
            fontWeight: 'bold',
            color: 'text',
          })}
        >
          {[entry.role, entry.company].filter(Boolean).join(' · ')}
        </span>
        <span
          className={css({
            display: { base: 'none', md: 'block' },
            flex: '1',
            minWidth: '16px',
            borderBottomWidth: '2px',
            borderBottomStyle: 'dotted',
            borderBottomColor: 'borderStrong',
            transform: 'translateY(-4px)',
            opacity: 0.7,
          })}
        />
      </div>
      {entry.description && (
        <p
          className={css({
            gridColumn: { md: '2' },
            textStyle: 'sm',
            color: 'textMuted',
            maxWidth: '58ch',
          })}
        >
          {entry.description}
        </p>
      )}
    </li>
  )
}

export function AboutTimeline() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px,5vw,80px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          fontSize: 'clamp(26px,4.4vw,44px)',
          lineHeight: '0.9',
          color: 'text',
          paddingBottom: '14px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        Career
      </h2>
      <ul className={css({ listStyle: 'none', padding: '0', margin: '0' })}>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}`} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
