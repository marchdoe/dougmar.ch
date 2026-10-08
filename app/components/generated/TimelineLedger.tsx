import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { Band, SecHead } from './Band'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  const head = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '160px 1fr' },
        columnGap: '5',
        rowGap: '2',
        paddingBlock: '16px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <span
        className={css({ fontSize: 'sm', color: 'textFaint', fontVariantNumeric: 'tabular-nums' })}
      >
        {entry.year}
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', minWidth: '0' })}>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', md: 'lg' },
            letterSpacing: 'tight',
            lineHeight: 'snug',
          })}
        >
          {head}
        </span>
        {entry.description ? (
          <p
            className={css({
              fontSize: 'sm',
              lineHeight: 'normal',
              bg: 'surface',
              borderRadius: 'sm',
              paddingBlock: '3',
              paddingInline: '4',
              maxWidth: '60ch',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineLedger() {
  return (
    <Band label="Experience">
      <SecHead
        title="Experience"
        std="Twenty years of design and engineering, held as one practice."
      />
      {timeline.map((entry) => (
        <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
      ))}
    </Band>
  )
}
