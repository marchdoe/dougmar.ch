import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

export function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li
      className={css({
        display: { base: 'flex', md: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 12rem',
        alignItems: { base: 'flex-start', md: 'baseline' },
        rowGap: '4px',
        columnGap: '14px',
        paddingBlock: '14px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
      })}
    >
      <span
        className={css({
          gridColumn: '2',
          gridRow: '1',
          fontFamily: 'display',
          fontSize: { base: 'sm', md: 'md' },
          fontVariantNumeric: 'tabular-nums',
          color: 'fieldInk',
          textAlign: { base: 'left', md: 'right' },
        })}
      >
        {entry.year}
      </span>
      <span
        className={css({
          gridColumn: '1',
          fontFamily: 'body',
          fontSize: 'base',
          fontWeight: 500,
          color: 'fieldInk',
        })}
      >
        {entry.role}
      </span>
      <span
        className={css({
          gridColumn: '1',
          fontFamily: 'body',
          fontSize: 'sm',
          color: 'fieldInkMuted',
        })}
      >
        {entry.company}
      </span>
      {entry.description ? (
        <p
          className={css({
            gridColumn: '1',
            marginTop: '4px',
            fontFamily: 'body',
            fontSize: 'sm',
            lineHeight: '1.6',
            color: 'fieldInkMuted',
            maxWidth: '46ch',
          })}
        >
          {entry.description}
        </p>
      ) : null}
    </li>
  )
}
