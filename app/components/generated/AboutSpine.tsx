import { css } from '../../../styled-system/css'
import { education, timeline } from '../../content/timeline'
import { CapabilityList, SpineHead, TrajectoryShell } from './TrajectoryShell'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: '132px minmax(0, 1fr)' },
        columnGap: '16px',
        rowGap: '4px',
        paddingBlock: '16px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        _first: { borderTopWidth: '0' },
      })}
    >
      <span
        className={css({
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'accentAlt',
          fontVariantNumeric: 'tabular-nums',
          paddingTop: { sm: '4px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' })}>
        <span
          className={css({
            fontSize: { base: 'base', sm: 'lg' },
            fontWeight: '600',
            color: 'text',
          })}
        >
          {[entry.role, entry.company].filter(Boolean).join(', ')}
        </span>
        {entry.description && (
          <p
            className={css({
              fontSize: 'base',
              lineHeight: '1.5',
              color: 'textMuted',
              maxWidth: '50ch',
            })}
          >
            {entry.description}
          </p>
        )}
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          })}
        >
          {entry.bullets?.map((bullet) => (
            <li
              key={bullet}
              className={css({
                fontSize: 'sm',
                lineHeight: '1.5',
                color: 'textMuted',
                maxWidth: '50ch',
              })}
            >
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

function EducationBlock() {
  return (
    <div className={css({ marginTop: '36px' })}>
      <SpineHead>Education</SpineHead>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '4px' })}>
        <span className={css({ fontSize: '17px', fontWeight: '600', color: 'text' })}>
          {education.school}
        </span>
        <span className={css({ fontSize: 'sm', color: 'textMuted' })}>
          {[education.degree, education.concentration].filter(Boolean).join(', ')}
        </span>
        {education.years && (
          <span
            className={css({
              fontSize: '12px',
              letterSpacing: '0.08em',
              fontWeight: 'bold',
              color: 'accentAlt',
            })}
          >
            {education.years}
          </span>
        )}
      </div>
    </div>
  )
}

export function AboutSpine() {
  return (
    <TrajectoryShell
      rail={
        <>
          <CapabilityList />
          <EducationBlock />
        </>
      }
    >
      <ol
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.role}`} entry={entry} />
        ))}
      </ol>
    </TrajectoryShell>
  )
}
