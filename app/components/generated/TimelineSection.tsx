import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SecLabel } from './SecLabel'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
        columnGap: '24px',
        rowGap: '4px',
        paddingBlock: '20px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        textStyle: 'sm',
      })}
    >
      <span className={css({ textStyle: 'sm', color: 'textMuted', minWidth: { md: '120px' } })}>
        {entry.year}
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' })}>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: { base: 'base', md: 'lg' },
            color: 'text',
          })}
        >
          {heading}
        </span>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'base',
              color: 'textMuted',
              maxWidth: '60ch',
              lineHeight: '1.55',
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
    <RevealSection
      className={css({
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingBottom: 'clamp(24px, 3vw, 40px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <SecLabel>Experience</SecLabel>
      <ol
        className={css({
          listStyle: 'none',
          marginTop: '20px',
          marginBottom: '0',
          padding: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {timeline.map((e) => (
          <TimelineRow key={`${e.year}-${e.company}-${e.role}`} entry={e} />
        ))}
      </ol>
    </RevealSection>
  )
}
