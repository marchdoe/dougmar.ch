import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

function Row({ e }: { e: Entry }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        paddingBlock: '3',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        md: {
          display: 'grid',
          gridTemplateColumns: '130px 1fr',
          columnGap: '4',
          alignItems: 'baseline',
        },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: { base: 'sm', md: 'md' },
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {e.year}
      </span>
      <div className={css({ minWidth: '0' })}>
        <p className={css({ fontSize: 'base', color: 'text' })}>
          <b className={css({ fontWeight: 'bold' })}>{e.role}</b>
          {e.role && e.company ? ', ' : ''}
          {e.company}
        </p>
        {e.description && (
          <p
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              maxWidth: '56ch',
              marginTop: '1',
            })}
          >
            {e.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function TimelineLedger() {
  return (
    <div>
      <h2
        className={css({
          textStyle: 'lg',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '2',
        })}
      >
        Timeline
      </h2>
      {timeline.map((e) => (
        <Row key={`${e.year}-${e.company}-${e.role}`} e={e} />
      ))}
    </div>
  )
}
