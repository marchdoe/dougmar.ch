import { css } from '../../../styled-system/css'
import { capabilities, timeline } from '../../content/timeline'
import { FieldPanel } from './Panels'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const who = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '120px 1fr' },
        columnGap: '4',
        rowGap: '1',
        paddingBlock: '4',
        borderBottom: '1px solid',
        borderBottomColor: 'fieldBorder',
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontWeight: 'bold',
          color: 'fieldInkMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', lg: 'lede' },
            color: 'fieldInk',
          })}
        >
          {who}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'base',
              color: 'fieldInk',
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

const kicker = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  marginBottom: '3',
})

export function TimelinePanel() {
  return (
    <FieldPanel>
      <div className={kicker}>The record</div>
      <h2
        className={css({
          textStyle: 'xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          color: 'fieldInk',
          marginBottom: '5',
        })}
      >
        Twenty years of acting on it.
      </h2>
      <ol
        className={css({
          listStyle: 'none',
          borderTop: '1px solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        {timeline.map((e) => (
          <TimelineRow key={`${e.year}-${e.role}-${e.company}`} entry={e} />
        ))}
      </ol>
      <div className={css({ marginTop: '6' })}>
        <div className={kicker}>Capabilities</div>
        <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                fontSize: 'sm',
                color: 'fieldInk',
                border: '1px solid',
                borderColor: 'fieldBorder',
                paddingInline: '3',
                paddingBlock: '1',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </FieldPanel>
  )
}
