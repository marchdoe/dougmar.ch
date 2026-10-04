import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { microClass, revealClass, sectionPadClass } from './styles'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 160px' },
        columnGap: '4',
        rowGap: '1',
        paddingBlock: '14px',
        paddingInline: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <div
        className={css({
          gridColumn: { md: '2' },
          gridRow: { md: '1' },
          textAlign: { base: 'left', md: 'right' },
          fontFamily: 'body',
          fontSize: 'sm',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          color: 'text',
        })}
      >
        {entry.year}
      </div>
      <div className={css({ gridColumn: { md: '1' }, gridRow: { md: '1' }, minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'body',
            fontSize: { base: 'base', md: 'lg' },
            fontWeight: 'bold',
            color: 'text',
          })}
        >
          {entry.role}
        </div>
        <div className={css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })}>
          {entry.company}
        </div>
        {entry.description ? (
          <p
            className={css({
              marginTop: '2',
              maxWidth: '50ch',
              fontSize: 'sm',
              lineHeight: '1.5',
              color: 'textMuted',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineSection() {
  return (
    <section className={revealClass}>
      <div className={sectionPadClass}>
        <div className={microClass}>Experience</div>
        <div
          className={css({
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
          })}
        >
          {timeline.map((entry) => (
            <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
