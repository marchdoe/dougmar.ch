import { css, cx } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { reveal } from './reveal'
import { SectionHead } from './SectionHead'

type Entry = { year: string; role: string; company: string; description: string }

function TimelineRow({ entry, first }: { entry: Entry; first: boolean }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
        columnGap: '5',
        rowGap: '1',
        paddingBlock: '4',
        borderTopStyle: 'solid',
        borderTopWidth: first ? '2px' : '1px',
        borderTopColor: first ? 'borderStrong' : 'border',
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          fontVariantNumeric: 'tabular-nums',
          color: { base: 'accentAlt', _light: 'text' },
          minWidth: { md: '120px' },
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <span
          className={css({
            display: 'block',
            fontWeight: 'bold',
            textStyle: { base: 'base', md: 'lg' },
            color: 'text',
          })}
        >
          {entry.role}
        </span>
        <span
          className={css({
            display: 'block',
            textStyle: { base: 'sm', md: 'base' },
            color: 'textMuted',
          })}
        >
          {entry.company}
        </span>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'base',
              color: 'textMuted',
              maxWidth: '48ch',
              marginTop: '2',
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
      aria-label="Experience"
      className={cx(
        reveal,
        css({
          bg: 'bg',
          color: 'text',
          paddingBlock: { base: '6', lg: '8' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <div className={css({ maxWidth: '960px', marginLeft: 'auto' })}>
        <SectionHead>Experience</SectionHead>
        <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
          {timeline.map((t, i) => (
            <TimelineRow key={`${t.year}-${t.company}-${t.role}`} entry={t} first={i === 0} />
          ))}
        </ol>
      </div>
    </section>
  )
}
